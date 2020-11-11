import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BeaconModel, BeaconService } from '../services/beacon.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Platform, Events, NavController, AlertController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Toast } from '@ionic-native/toast/ngx';
declare var MapwizeUI: any;

@Component({
  selector: 'app-see-people',
  templateUrl: './see-people.page.html',
  styleUrls: ['./see-people.page.scss'],
})
export class SeePeoplePage implements AfterViewInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/first'
    },
  ];

  mapwizeMap: any;
  scheduled = [];
  devices: any[] = [];
  beacons: BeaconModel[] = [];
  zone: any;
  rssi: any;
  tracker: string = "Personas Asociadas";
  person: any;
  asociatedPerson: string = "Personas asignadas";
  asociatedId: any;
  asociatedIdAlert: any;
  bellAlert: number = 0;
  beaconsPoints: any;
  lastBeacon: any;
  myurl = new URL("http://www.google.com");
  iab: any;
  constructor(
    private ble: BLE,
    private ngZone: NgZone,
    public beaconService: BeaconService,
    public platform: Platform,
    public events: Events,
    public navCtrl: NavController,
    private services: CrudService,
    private params: UtilsService,
    private localNotificactions: LocalNotifications,
    private alertCtrl: AlertController,
    private router: Router,
    private modalController: ModalController,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private toast: Toast,
    public actionSheetController: ActionSheetController,
    public loadingCtrl: LoadingController ) {

    this.zone = new NgZone({ enableLongStackTrace: false });
    /*this.platform.ready().then(() => {
      this.localNotificactions.on('click').subscribe(res => {
        let msg = res.data ? res.mydata : '';
        this.setVibration();

      });
      this.localNotificactions.on('trigger').subscribe(res => {
        let msg = res.data ? res.mydata : '';
        this.setVibration();
        this.showAlert(res.title, res.text, msg);

      });
    });*/
  }

  ngAfterViewInit() {
    //this.ScanAll();
    this.getLastBeacon();
    this.getBeaconsPointLocal();
    this.getUserAsociatedPerson();
    this.getAsociatedId();
    this.ionViewDidLoad();
    setTimeout(() => {
      this.getAsociatedAlerts();
    }, 1000);
  }

  getUserAsociatedPerson() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      this.person = this.person.asocietedpeople;
      if (this.person.length == 0) {
        this.asociatedPerson = "No tiene personas asociadas";
      }
    }, (err) => {
      console.error(err);
    });
  }

  getAsociatedId() {
    this.storeService.localGet(this.localParam.localParam.alertsId).then((resp) => {
      this.asociatedId = resp;
    }, (err) => {
      console.error(err);
    });
  }

  ScanAll() {
    this.devices = [];
    this.ble.scan([], 15).subscribe(
      device => this.onDeviceDiscovered(device)
    );
  }

  getLastBeacon() {
    this.storeService.localGet(this.localParam.localParam.lastBeacon).then((resp) => {
      this.lastBeacon = resp;
    }, (err) => {
      console.error(err);
    });
  }

  onDeviceDiscovered(device) {
    console.log('Discovered' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device)
      for (let i = 0; i < this.devices.length; i++) {
        for (let j = 0; j < this.devices.length; j++) {
          if (this.devices[i].rssi > this.devices[j].rssi) {
            this.ble.connect(this.devices[i].id);
            this.storeService.localSave(this.localParam.localParam.lastBeacon, this.devices[i]);
            console.log(this.devices[i].rssi);
          }
        }
      }
      console.log(device)
    })
  }
  //Metodo para probar la conexion de los beacons
  wea() {
    let beacon = [
      {
        id: '15',
        rssi: 70
      },
      {
        id: '16',
        rssi: 65
      },
      {
        id: '17',
        rssi: 75
      },
    ];
    for (let i = 0; i < beacon.length; i++) {
      if (beacon[i].rssi > 70) {
        this.ble.connect(beacon[i].id);
        this.storeService.localSave(this.localParam.localParam.lastBeacon, beacon[i]);
        console.log("entra al if del getLastBeacon");
      }
    }
    //console.log(device)
  }

  //lectura de beacons
  ionViewDidLoad() {

    this.platform.ready().then(() => {
      this.beaconService.initialise().then((isInitialised) => {
        if (isInitialised) {
          this.listenToBeaconEvents();
        }
      });
    });
  }

  listenToBeaconEvents() {
    this.events.subscribe('didRangeBeaconsInRegion', (data) => {
      // update the UI with the beacon list
      this.zone.run(() => {
        this.beacons = [];
        let beaconList = data.beacons;
        beaconList.forEach((beacon) => {
          let beaconObject = new BeaconModel(beacon);
          this.beacons.push(beaconObject);
        });

      });

    });
  }
  //fin de la lectura de beacons
  // vibración
  setVibration() {
    navigator.vibrate([500, 500, 500]);


  }
  //fin de vibración

  //inicio de notificaciones
  scheduleNotification() {
    this.localNotificactions.schedule({
      id: 1,
      title: 'Attention',
      text: 'Jairo Notification',
      data: { mydata: 'My hidden message this is' },
      vibrate: true,
      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },

    });

  }
  send() {

    this.localNotificactions.schedule({
      title: 'Attention',
      text: 'Jairo Notification',
      trigger: { at: new Date(new Date().getTime() + 6000) },
      led: 'ff0000',
      foreground: true
    });

  }


  recurringNotification() {
    this.localNotificactions.schedule({
      id: 22,
      title: 'Recurring',
      text: 'Jairo Notification',
      vibrate: true,
      trigger: { every: ELocalNotificationTriggerUnit.MINUTE },
      launch: true,
      lockscreen: true,
      actions: [
        { id: 'yes', title: 'Yes' },
        { id: 'no', title: 'No' }
      ]

    });

  }
  repeatDaily() {
    this.localNotificactions.schedule({
      id: 42,
      title: 'Good Morning',
      text: 'Jairo Notification',
      vibrate: true,
      trigger: { every: { hour: 11, minute: 50 } },

    });

  }
  getAll() {
    this.localNotificactions.getAll().then(res => {
      this.scheduled = res;
    });
    this.setVibration();
  }
  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  // fin de notificaciones

  go(id) {
    //this.presentLoadingDefault();
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + id);
  }

  goNotification() {
    this.router.navigateByUrl('menu/third');
  }

  heartmonitor() {
    this.router.navigateByUrl('/heart-rate');
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalPagePage,
    });
    modal.present();
  }

  //Busca las alertas de las personas asociadas, si sale null es porque no encontró alerta en alguno
  getAsociatedAlerts() {
    let id;
    for (let i = 0; i < this.asociatedId.length; i++) {
      id = this.asociatedId[i];
      this.services.get(this.params.params.beaconurl + "/tracker/person/alert/" + id).subscribe((resp) => {
        this.asociatedIdAlert = resp;
        if (this.asociatedIdAlert.alerts.length < 1) {
          for (let x = 0; x < this.asociatedIdAlert.alerts.length; x++) {
            if (this.asociatedIdAlert.alerts[i].isResolved == false) {
              this.bellAlert++;
              this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
            }
          }
        } else if (this.asociatedIdAlert.alerts.isResolved == false) {
          this.bellAlert++;
          this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
        }
        //this.storeService.localSave(this.localParam.localParam.alertsId, asociatedId);
      }, (err) => {
        console.error(err);
      });
    }
  }
  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }
  getBeaconsPointLocal() {
    this.storeService.localGet(this.localParam.localParam.gatewaybeacons).then((resp) => {
      this.beaconsPoints = resp;
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

  doBinary() {
    /*let items = [];
    for(let i = 0; i < this.beaconsPoints.length; i++){
      items.push(this.beaconsPoints[i].externalid);
    }
    console.log(items);*/
    let beaconsId;
    for (let i = 0; i < this.devices.length; i++) {
      beaconsId = this.devices[i].id;
    }
    let items = ["A54SSA", "C21510", "PA5454", "SA54AS"];
    let value = beaconsId.replace(/:/g, "");
    console.log(value);
    let index = this.binarySearch(items, value);

    console.log(index);
  }


  //ejemplos de alert
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Consejo del día!',
      subHeader: '',
      message: 
      'Le recomendamos: <br><br> *Un super descuento 25% <br> <br><a href="https://www.fischelenlinea.com/detalle-producto?id=698&name=Ofertas&cat=46&color=6&ProName=IBUPROFENO%20600%20MG%20TABLETAS%20VIA%20ORAL"><img class="img-resp" src="../../assets/img/an.png"></img></a>',
      buttons: [{
        text: 'Cancel',
        role: 'Cancel',
        handler: () => {
          console.log('you clicked me');
        }
      },
      {
        text: 'Comprar Aqui',
        cssClass: 'secondary',
        handler: () => {
          console.log('Seconds handler')
          window.location.href='https://www.fischelenlinea.com/detalle-producto?id=698&name=Ofertas&cat=46&color=6&ProName=IBUPROFENO%20600%20MG%20TABLETAS%20VIA%20ORAL';
        }
      },
      {
        text: 'Open action',
        cssClass: 'primary',
        handler: async () => {
          const action = await this.actionSheetController.create({
            header: 'Farmacia Fisher',
            buttons: [
              {
                text: 'Comprar ',
                icon: 'cart',
                handler: () => {
                  window.location.href='https://www.fischelenlinea.com/detalle-producto?id=698&name=Ofertas&cat=46&color=6&ProName=IBUPROFENO%20600%20MG%20TABLETAS%20VIA%20ORAL';
                }
              },
            ]
          });
          await action.present();
        }
      },
      ]
    });
    await alert.present();
  }

//spinner de carga
  async presentLoadingDefault() {
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
}//fin de la class
