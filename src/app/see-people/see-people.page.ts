import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BeaconModel, BeaconService } from '../services/beacon.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Platform, Events, NavController, AlertController, ModalController } from '@ionic/angular';
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
  serviceUUID = "C2:46:F9:66:19:CD";
  serviceUUID2 = "C8:D6:32:BF:C5:F6";
  zone: any;
  rssi: any;
  tracker: string = "Personas Asociadas";
  person: any;
  asociatedPerson: string = "Personas asignadas";
  asociatedId: any;
  asociatedIdAlert: any;
  bellAlert: number = 0;

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
    private toast: Toast) {

    this.zone = new NgZone({ enableLongStackTrace: false });
    this.platform.ready().then(() => {
      this.localNotificactions.on('click').subscribe(res => {
        let msg = res.data ? res.mydata : '';
        this.setVibration();

      });
      this.localNotificactions.on('trigger').subscribe(res => {
        let msg = res.data ? res.mydata : '';
        this.setVibration();
        this.showAlert(res.title, res.text, msg);

      });
    });
  }

  ngAfterViewInit() {
    this.ScanAll();
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
ScanAll(){
  this.devices=[];
  this.ble.scan([],15).subscribe(
    device=> this.onDeviceDiscovered(device)
  );
}
  Scan() {
    this.devices = [];
    this.ble.connect(this.serviceUUID).subscribe(
      device => this.onDeviceDiscovered(device)
    );
  }
  readRSSI() {
    var rssiSample;
    this.Scan();
    this.alert(`ACA`);
    rssiSample = setInterval(function () {
      this.ble.readRSSI(this.serviceUUID, function (rssi) {
       console.log('read RSSI', rssi, 'with device', this.serviceUUID);
      }, function (err) {
        console.error('unable to read RSSI', err);
        clearInterval(rssiSample);
      })
    }, 5000),

    function () { console.error('error connecting to device'); }
  }

  scan2() {
    this.devices = [];
    this.ble.startScan([]).subscribe(
      device => this.onDeviceDiscovered(device));
  }
  s() {
    this.ble.startScan([]).subscribe(device => {
      console.log(JSON.stringify(device));
    });

    setTimeout(this.ble.stopScan,
      5000,
      function () { console.log("Scan complete"); },
      function () { console.log("stopScan failed"); }
    );
  }

  onDeviceDiscovered(device) {

    console.log('Discovered' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device)
      console.log(device)
    })
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

  peopleLocation() {


    const myCustomMarker = new mapboxgl.Marker({ color: 'green' });


    this.mapwizeMap.on('mapwize:markerclick', e => {
      alert('marker: ' + e.marker);
    });
    this.mapwizeMap.addMarker({
      latitude: 9.974562999019767,
      longitude: -84.74976922280277,
      floor: 0,
    }, myCustomMarker).then((marker => {

      var s = "";
    }));
  }
  go(id) {
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + id);
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
  alert(msg: string){
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );    
  }
}//fin de la class
