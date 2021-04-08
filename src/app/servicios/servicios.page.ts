import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, Events, IonBackdrop, ModalController, Platform, ToastController } from '@ionic/angular';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component'

import { ModalNotificationPage } from '../modal-notification/modal-notification.page';
import { CrudService } from '../services/crud.service';
import { IconsService } from '../services/icons.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { UtilsService } from '../services/utils.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../services/authentication.service';
import { BeaconService } from '../services/beacon.service';
import { timeout } from 'rxjs/operators';
import { BLE } from '@ionic-native/ble/ngx';
import { Toast } from '@ionic-native/toast/ngx';

export interface PlaceInfo {
  placeId: String,
  lat: String,
  long: String
}

export interface AssitanceTicket {
  status?: String,
  assistant?: String,
  asset?: String,
  patient: Object,
  init_location: String,
  lat: String,
  long: String,
  assistance_type: String
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  placeInfo: PlaceInfo = {
    placeId: "",
    lat: "",
    long: ""
  }
  services = [];
  options: any = [
    {
      id: 1,
      name: 'Solicitar silla de Ruedas',
    },
    {
      id: 2,
      name: 'Solicitar Ayudante',
    },
  ]
  backdropBool = false;
  hasAsist = false;
  assistance: Object;

  @ViewChild("bottomSheet", { static: false }) bottomSheet: BottomSheetComponent;

  loggedUser: any;
  zone: any;
  assistanceTypeId: any;
  beaconLocationInfo: any;
  waitingAssignInterval: NodeJS.Timer;
  waitingAssignTimeOut: NodeJS.Timer;
  devices: any[] = [];
  ticketTitle: String;
  ticketDescription: String;
  beaconsPoints: any;
  lastBeacon: any;
  intervalBeacons: any;
  stopBeaconsCan: boolean=false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    public modalController: ModalController,
    private iconService: IconsService,
    private crudService: CrudService,
    private params: UtilsService,
    private storageService: StorageService,
    private localParams: UtilStorageService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private auth: AuthenticationService,
    public actionSheetController: ActionSheetController,
    public beaconService: BeaconService,
    public events: Events,
    private ngZone: NgZone,
    private ble: BLE,
    public platform: Platform,
    private toast: Toast
    // public bottomSheet: BottomSheetComponent,
  ) {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {
    console.log('entro a ngoninit')
    this.crudService.get(this.params.params.ticketServices).subscribe((resp: []) => {
      this.services = resp;
      this.services = this.iconService.setIconsToServices(this.services);
    })
    this.crudService.get(this.params.params.assistance_types + 'all').subscribe(res => {
      console.log('entro a la lista de asistentes')
      console.log(res)
      this.options = res;
    });
    this.storageService.localGet(this.localParams.localParam.insuredUser).then(user => {
      this.loggedUser = user;
      console.log(this.loggedUser);
    });
    // this.presentToastWithOptions()
  }

  toGo(route) {
    this.router.navigateByUrl(route);
  }

  getMeATicket(service) {
    this.storage.keys().then(data => console.log(data))
    this.hasTicket().then(ticketStatus => {
      if (ticketStatus == null) {
        let id = service.serviceId;
        this.placeInfo.placeId = service.icon.placeId;
        this.placeInfo.lat = service.icon.lat;
        this.placeInfo.long = service.icon.long;
        this.storageService.localSave(this.localParams.localParam.places, this.placeInfo);
        this.router.navigate(['/coronavirus'], { state: { data: { id } } });
      } else {
        this.showAlert("Ya posée un ticket", "Por favor revise la informacion de su ticket activo.", null)
      }
    });
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'En caso de embarazo',
      message: 'Por favor llenar la siguiente encuesta.',
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        }, {
          side: 'end',
          text: 'Ir',
          role: 'ok',
          handler: () => {
            this.router.navigateByUrl("/prenatal-control");
          },
        }
      ]
    });
    toast.present();
  }
  goPrenal() {
    this.router.navigateByUrl("/prenatal-control");
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationPage,
      cssClass: 'my-modal-class',
      animated: true
    });
    return await modal.present();
  }

  async showAlert(header?: string, msg?: string, subHeader?: string) {
    const alert = await this.alertCtrl.create({
      header: header || "",
      subHeader: subHeader || "",
      message: msg || "",
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          //console.log('you clicked me');
        }
      },
      ]
    });
    await alert.present();
  }

  goToIndoors() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/0');
  }

  hasTicket() {
    return this.storageService.localGet(this.localParams.localParam.createdTicket);
  }
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  openBottomSheet() {
    this.bottomSheet.open();
    this.backdropBool = true;
  }

  selectOption(assistanceTypeId) {
    this.assistanceTypeId = assistanceTypeId;
    this.bottomSheet.close();
    this.hasAsist = true;
    this.searchUserLocation();
  }

  searchUserLocation() {
    if (this.platform.is('ios')) {
      let userLocation: any = {};
      let makeRequest = true
      this.beaconService.initialise()
      this.events.subscribe('didRangeBeaconsInRegion', (res) => {
        this.zone.run(() => {
          if (res.beacons.length && makeRequest) {
            makeRequest = false;
            this.searchBeaconInfoCreateTicket(res.beacons[0].minor)
          }
        });
      });
    }
    if (this.platform.is('android')) {
      this.stopBeaconsCan=false;
        this.getBeaconsPointLocal();    
    }
  }

  searchBeaconInfoCreateTicket(minor) {
    this.storageService.localGet(this.localParams.localParam.gatewaybeacons).then((beaconsArray: []) => {
      beaconsArray.map((beacon) => {
        if (beacon['minor'] === minor) {
          console.log(beacon);
          this.beaconLocationInfo = beacon;
          this.createAssistanceTicket();
        }
      });
    });
  }

  createAssistanceTicket() {
    const newAssitanceTicket: AssitanceTicket = {
      assistance_type: this.assistanceTypeId,
      patient: this.loggedUser,
      init_location: this.beaconLocationInfo.point.description,
      lat: this.beaconLocationInfo.point.lat,
      long: this.beaconLocationInfo.point.lon,
    }
    console.log(newAssitanceTicket);
    this.crudService.post(this.params.params.assistance_tickets, newAssitanceTicket).then((assistanceTicket: Object) => {
      console.log(assistanceTicket);
      this.assistance = {
        status: assistanceTicket['status'],
        ticketId: assistanceTicket['_id'],
        type: { ...assistanceTicket['assistance_type'] }
      }
      this.ble.stopScan();
      this.beaconService.stop();
      this.waitingAssignInterval = setInterval(() => { this.catChangesOnAssign() }, 3000);
      this.waitingAssignTimeOut = setTimeout(() => {
        this.stopTimers();
        this.closeSOSEvent('UNRESOLVED');
      }, 300000);
    }).catch((err) => {
      this.alert("error:"+err);
      this.beaconService.stop();
      this.ble.stopScan();
    });
  }

  catChangesOnAssign() {
    console.log('entrando al metodo catChangesOnAssign')
    this.crudService.get(`${this.params.params.assistance_tickets}/${this.assistance['ticketId']}`).subscribe((data) => {
      console.log(data);
      if (data['status'] !== 'PENDING') {
        console.log('No esta pendiente el ticket')
        this.assistance['status'] = data['status'];
        if (data['assistance_type'].category === 'STAFF') {
          console.log('El ticket solicita un mienbro del staff')
          this.assistance['title'] = data['assistant'].name
          this.assistance['description'] = data['assistant'].subcategory
          console.log(this.assistance);
          // this.ticketTitle =  this.assistance['title'];
          // this.ticketDescription = this.assistance['description'];
          // console.log(`title: ${this.ticketTitle}\n description: ${this.ticketDescription}`);
        } else if (data['assistance_type'].category === 'ASSET') {
          console.log('El ticket solicita un activo del hospital')
          this.assistance['title'] = data['asset'].name
          this.assistance['description'] = data['asset'].subcategory
          // this.ticketTitle =  this.assistance['title'];
          // this.ticketDescription = this.assistance['description'];
        }
        this.stopTimers();
      }
    });
  }

  stopTimers() {
    console.log('entrando al metodo stopTimers')
    clearInterval(this.waitingAssignInterval)
  }

  closeSOSEvent(action: string) {
    const ticketId = this.assistance['ticketId'];
    const body = {
      status: action
    }
    this.crudService.put(`${this.params.params.assistance_tickets}${ticketId}`, body).subscribe(res => {
      if (res['status'] === action) {
        this.stopTimers();
        this.assistance = null;
        this.hasAsist = false;
      }
    });
  }

  consoleado(evt) {
    const backDrop = <IonBackdrop>evt.srcElement;
    backDrop.stopPropagation = true;
    backDrop.tappable = true;
    backDrop.visible = false;

    console.log(evt);
    console.log(backDrop.ionBackdropTap);
  }
  //metodo para scannear beacons en android
  ScanBeaconsAll() {
    try {
      this.devices = [];
      this.ble.startScan([]).subscribe(
        device => this.onDeviceDiscovered(device),
        error => console.log("No devices because " + error),
      );
    } catch (Error) {
      console.log(Error.message);
    }
  }//fin del metodo scan
  onDeviceDiscovered(device) {

    this.ngZone.run(() => {
      this.devices.push(device);
      this.doBinary();
     // this.alert("esta scanneado"+this.devices);
    })
  }
  getLastBeacon() {
    this.storageService.localGet(this.localParams.localParam.lastBeacon).then((resp) => {
      this.lastBeacon = resp;
      // console.warn(this.lastBeacon);
    }, (err) => {
      console.error(err);
    });
  }
  binarySearch(items, value) {
    let startIndex = 0,
      stopIndex = items.length - 1,
      middle = Math.floor((stopIndex + startIndex) / 2);

    while (items[middle] != value && startIndex < stopIndex) {
      //adjust search area
      if (value < items[middle]) {
        stopIndex = middle - 1;
      } else if (value > items[middle]) {
        startIndex = middle + 1;
      }
      //recalculate middle
      middle = Math.floor((stopIndex + startIndex) / 2);
    }
    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
  }
  getBeaconsPointLocal() {
    try {
      this.storageService.localGet(this.localParams.localParam.gatewaybeacons).then((resp) => {
        this.beaconsPoints = resp;
        this.timerScanBeacons();
        
      }, (err) => {
        console.log(err);
       
      });
    } catch (e) {
      console.log(" Error del catch " + e)
    }
  }
  timerScanBeacons() {
    if(this.platform.is('android')){
      if(this.stopBeaconsCan==false){
    this.intervalBeacons = setInterval(() => {
      this.ScanBeaconsAll();
      //this.alert('Scanning...');
    }, 1000);
  }
}
  }
  doBinary() {

    let items = [];
    for (let i = 0; i < this.beaconsPoints.length; i++) {
      items.push(this.beaconsPoints[i].shortid);
    }
    let beaconsId = [];
    let value = [];
    let lastFive = [];
    let index;
    let bdataArray = [];

    for (let i = 0; i < this.devices.length; i++) {
      beaconsId.push(this.devices[i].id);
      value.push(beaconsId[i].replace(/:/g, ""));
      lastFive.push(value[i].substr(value[i].length - 5));
      index = this.binarySearch(items, lastFive[i]);
      if (index > -1) {
        if (this.devices[i].rssi >= -85 && this.devices[i].rssi <= 0) {
          var bdata = {
            id: this.devices[i].id,
            rssi: this.devices[i].rssi

          }
          bdataArray.push(bdata);
        }
      }//fin de if
    }
    bdataArray.sort((a, b) => a.rssi - b.rssi);
    bdataArray.reverse();

    this.storageService.localSave(this.localParams.localParam.lastBeacon, bdataArray[0]);
    this.testWayFinding();
  }//fin del dobinary
  testWayFinding() {
    this.getLastBeacon();
    let point;
    let beaconMac;
    let index;
    let value;
    let items = [];
    let shortMac;
 
    for (let i = 0; i < this.beaconsPoints.length; i++) {
      items.push(this.beaconsPoints[i].shortid);
    }
    
    beaconMac = this.lastBeacon.id;
    shortMac = beaconMac.replace(/:/g, "");
    value = shortMac.substr(shortMac.length - 5);
    index = this.binarySearch(items, value);


    if (index > -1) {
      this.beaconLocationInfo=this.beaconsPoints[index];
      if(!this.stopBeaconsCan){
        this.stopBeaconsCan=true;
        this.createAssistanceTicket();
      }
      clearInterval(this.intervalBeacons);
      //this.alert(this.beaconLocationInfo.point.description);
    }
    
  }
  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }
}//fin
