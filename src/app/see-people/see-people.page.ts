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
  serviceUUID = ["C2:46:F9:66:19:CD", "C8:D6:32:BF:C5:F6"];
  zone: any;
  rssi: any;
  tracker: string = "Personas Asociadas";
  person: any;
  asociatedPerson: string= "Personas asignadas";

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
    private modalController:ModalController,
    private storeService: StorageService,
    private localParam: UtilStorageService) {

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
    //this.Scan();
    this.getUserAsociatedPerson();
    this.ionViewDidLoad();
  }

  getUserAsociatedPerson(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      this.person = this.person.asocietedpeople;
      console.log(this.person);
      if(this.person.length == 0){
        this.asociatedPerson = "No tiene personas asociadas";
      }
    }, (err) => {
      console.error(err);
    });
  }

  Scan() {
    this.devices = [];
    this.ble.startScan(this.serviceUUID).subscribe(
      device => this.onDeviceDiscovered(device)


    );

  }

  onDeviceDiscovered(device) {

    console.log('Discovered' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device)
      console.log(device)
    })
  }

  ionViewDidLoad() {
    this.tracker = "ionviweDiaload";
    this.platform.ready().then(() => {
      this.tracker = "ionviweDiaload-then01";
      this.beaconService.initialise().then((isInitialised) => {
        this.tracker = "ionviweDiaload-then02";
        if (isInitialised) {
          this.tracker = "ionviweDiaload-ini";
          this.listenToBeaconEvents();
        }
      });
    });
  }

  listenToBeaconEvents() {
    this.events.subscribe('didRangeBeaconsInRegion', (data) => {

      // update the UI with the beacon list
      this.zone.run(() => {
        this.tracker = "ionviweDiaload-run";
        this.beacons = [];

        let beaconList = data.beacons;
        beaconList.forEach((beacon) => {
          let beaconObject = new BeaconModel(beacon);
          this.beacons.push(beaconObject);
        });

      });

    });
  }

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
  setVibration() {
    navigator.vibrate([500, 500, 500]);


  }
  recurringNotification() {
    this.localNotificactions.schedule({
      id: 22,
      title: 'Recurring',
      text: 'Jairo Notification',
      vibrate: true,
      trigger: { every: ELocalNotificationTriggerUnit.MINUTE },

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


  peopleLocation() {
  

    const myCustomMarker = new mapboxgl.Marker({ color: 'green' });
 

    this.mapwizeMap.on('mapwize:markerclick', e => {
      alert('marker: ' + e.marker);
    });
    this.mapwizeMap.addMarker({
      latitude: 9.974562999019767,
      longitude:-84.74976922280277,
      floor: 0,
    }, myCustomMarker).then((marker => {

      var s = "";
    }));
  }
  go(id){
    this.router.navigateByUrl('/menu/first/tabs/tab1/'+id);
  }
  async openModal(){
    const modal= await this.modalController.create({
  component: ModalPagePage,
    });
    modal.present();
  }
}//fin de la class
