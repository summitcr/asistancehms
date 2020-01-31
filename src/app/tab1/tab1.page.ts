import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AlertController, NavController, Platform, Events, ModalController, ActionSheetController } from '@ionic/angular';
import { from } from 'rxjs';
import { BeaconService, BeaconModel } from '../services/beacon.service';
import { UtilsService } from '../services/utils.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { CrudService } from '../services/crud.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Storage } from '@ionic/storage';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import mapboxgl from 'mapbox-gl';
import { SeePeoplePage } from '../see-people/see-people.page';
import { Router, ActivatedRoute } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';

//declare var require:any;
//const Mapwize = require('mapwize');
declare var MapwizeUI: any;


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
  pages = [
    {
      title: 'Notificacion',
      url: 'notification/third'
    },];

  beacons: BeaconModel[] = [];
  zone: any;
  mapwizeMap: any;
  person: any;
  alertAmount: any;
  isTest: boolean = true;
  urlId: any;
  trackerPerson: any;
  interval: any;
  loggedPersonAlert: any;
  loggedPersonInfor: any;
  personAlerts: any;
  personInfo: any;
  trackerLogged: any;
  asocietedName: any;
  asociatedAlerts = "No hay alertas";
  alertsQuantity: any;
  loggedLatitude: any;
  loggedLongitude: any;
  loggedPlaceId: string;
  asociatedPersonTime: any;
  asociatedPlaceId: string;
  stopPopUp = false;
  devices: any[] = [];
  lastBeacon: any;
  beaconsPoints: any;
  lastBeaconsLat: any;
  lastBeaconsLong: any;
  secondSpended: any;
  desc: any;
  pointDesc: any;
  trackBeacons: any;
  actionSheet: any = null;

  constructor(private storage: Storage,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private service: CrudService,
    private params: UtilsService,
    public beaconService: BeaconService,
    public platform: Platform,
    public events: Events,
    public services: UtilsService,
    private seePeople: SeePeoplePage,
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    private ble: BLE,
    private ngZone: NgZone, ) {

    //Mapwize.apiKey("439578d65ac560a55bb586feaa299bf7");
    this.zone = new NgZone({ enableLongStackTrace: false });

  }

  ngOnInit() {
    //Obtener el id de la url
    this.urlId = this.route.snapshot.paramMap.get("id");
    //console.log("EL ID DE LA RUTA ES: "+this.urlId);
  }

  //Metodo que busca el id de la persona loggeada para obtener la informacion.
  personLoggedLocation() {
    this.service.get(this.params.params.beaconurl + "/tracker/person/alert/" + this.person.person.id).subscribe((resp) => {
      this.trackerLogged = resp;
      this.loggedPersonAlert = this.trackerLogged.alerts;
      this.loggedPersonInfor = this.trackerLogged.summary;
      this.loggedLatitude = Number(this.loggedPersonInfor.Point.lat);
      this.loggedLongitude = Number(this.loggedPersonInfor.Point.lon);
      this.loggedPlaceId = this.loggedPersonInfor.Point.externalid;
      console.log(this.loggedPlaceId);
      this.secondSpended = this.transform(this.loggedPersonInfor.secondsspended);
      this.desc = this.loggedPersonInfor.Point.description;
      //this.personLocation();
      this.asociatedPersonLocation();
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que busca el id de la persona asociada para obtener su informacion
  asociatedPersonLocation() {
    if (this.urlId != 0 && this.urlId.length <= 10) {
      this.service.get(this.params.params.beaconurl + "/tracker/person/alert/" + this.urlId).subscribe((resp) => {
        this.trackerPerson = resp;
        this.personAlerts = this.trackerPerson.alerts;
        this.personInfo = this.trackerPerson.summary;
        let lat = Number(this.personInfo.Point.lat);
        let lon = Number(this.personInfo.Point.lon);
        let desc = this.personInfo.Point.description;
        this.asociatedPlaceId = String(this.personInfo.Point.externalid);
        console.log(this.trackerPerson);
        this.asociatedPersonTime = this.transform(this.personInfo.secondsspended);
        this.setAsociatedPersonPoint(lat, lon, desc);
      }, (err) => {
        console.error(err);
      });
    }
  }

  //Metodo que revisa si la persona asociada tiene alertas
  haveAlerts() {
    if (this.personAlerts === null) {
      this.asociatedAlerts = "No hay alertas que revisar";
    }
    else if (this.personAlerts.length < 1) {
      for (let i = 0; i < this.trackerPerson.alerts.length; i++) {
        if (this.personAlerts[i].isResolved == false) {
          this.asociatedAlerts = "Hay alertas que revisar";
        }
      }
    } else if (this.personAlerts.isResolved == false) {
      this.asociatedAlerts = "Hay alertas que revisar";
    }
  }

  //Metodo que pone el punto de la persona asociada en el mapa
  setAsociatedPersonPoint(lat, lon, desc) {
    for (let i = 0; i < this.person.asocietedpeople.length; i++) {
      if (this.person.asocietedpeople[i].id == this.urlId) {
        this.asocietedName = this.person.asocietedpeople[i].name;
      }
    }

    //Metodo que revisa si la persona asociada tiene alertas
    this.haveAlerts();

    const myCustomMarker = new mapboxgl.Marker({ color: 'blue' });
    myCustomMarker.setPopup(new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false
    }).setHTML('<h4>' + this.asocietedName + '</h4><p>' + "Punto: " + desc +
      '<br>' + "Tiempo: " + this.asociatedPersonTime + '<br>' + "Alertas: " + this.asociatedAlerts + '</p>'));

    this.mapwizeMap.on('mapwize:markerclick', e => {
      alert('marker: ' + e.marker);
    });
    this.mapwizeMap.addMarker({
      latitude: lat,
      longitude: lon,
      floor: 0,
    }, myCustomMarker).then((marker => {

      var s = "";
    }));

    /////////Se asegura de que placeId no sea 0, si es así muestra un popup///////////
    if (this.trackBeacons != "0" && this.asociatedPlaceId != "0") {
      var dir = {
        "from": {
          "lat": this.loggedLatitude,
          "lon": this.loggedLongitude,
          "placeId": this.trackBeacons
        },
        "to": {
          "lat": lat,
          "lon": lon,
          "placeId": this.asociatedPlaceId
        },
        "options": { "isAccessible": false }
      };

      this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
        this.mapwizeMap.setDirection(response);
      }, (err) => {

        console.error(err);
      });
    } else {
      if (!this.stopPopUp) {
        //this.stopPopUp = true;
        if(this.actionSheet == null){
          this.presentActionSheet();
        }else if(this.actionSheet != null){
          this.actionSheet.dismiss();
          this.presentActionSheet();
        }
        else{
          this.actionSheet.buttons[0].text = "Por favor, inténtelo de nuevo.";
        }
      }
    }
  }

  //Popup cuando la persona asociada no tiene registros
  async presentActionSheet() {
    this.actionSheet = await this.actionSheetController.create({
      header: 'La persona asociada no presenta registros:',
      buttons: [{
        text: 'No hay registro desde: ' + this.asociatedPersonTime + '. Por favor inténtelo de nuevo',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.stopPopUp = true;
        }
      }]
    });
    await this.actionSheet.present();
  }

  //metodo para actualizar la ubicacion de la persona asociada
  timer() {
    this.personLoggedLocation();
    this.interval = setInterval(() => {
      if (this.urlId != null) {
        this.mapwizeMap.removeMarkers();
        this.personLoggedLocation();
      }
    }, 15000);
  }



  getUserLogged() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      //console.log(this.person);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para obtener las alertas desde el Storage local
  getAlertAmount() {
    this.storeService.localGet(this.localParam.localParam.alerts).then((resp) => {
      this.alertAmount = resp;

    }, (err) => {
      console.error(err);
    });
  }

  setVibration() {
    navigator.vibrate([500, 500, 500]);

    console.log(this.person.name);
    console.log(this.person.identifier);
    console.log(this.person.personasocieted);
  }

  //Metodo con el que se esta probando la creacion de ruta y marcador de los tiquetes
  setRoute() {
    //el from placeId es el this.trackBeacons, por el momento esta alambrado para probar los tiquetes
    if (this.urlId != 0 && this.urlId.length >= 10){
      var dir = {
        "from": { "placeId": "5df0831fc03d5f0016312c3a" },
        "to": { "placeId": this.urlId },
        "options": { "isAccessible": false }
      };
  
      this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
        this.mapwizeMap.setDirection(response);
      }, (err) => {
  
        console.error(err);
      });

      this.mapwizeMap.removeMarkers();
    //Marcador donde se ubica la persona
    const myCustomMarker = new mapboxgl.Marker({ color: '#C51586' });
    myCustomMarker.setPopup(new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false
    }).setHTML('<p>' + " Pasillo Mujeres Sur " + '</p>'));

    this.mapwizeMap.on('mapwize:markerclick', e => {
      alert('marker: ' + e.marker);
    });
    this.mapwizeMap.addMarker({
      latitude: 9.975141924796077,
      longitude: -84.74964351318235,
      floor: 0,
    }, myCustomMarker).then((marker => {

      var s = "";
    }));

    //Marcador hacia donde va la persona
    const goMarker = new mapboxgl.Marker({ color: '#C51586' });
    goMarker.setPopup(new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false
    }).setHTML('<p>' + " Pasillo Hombres Norte " + '</p>'));

    this.mapwizeMap.on('mapwize:markerclick', e => {
      alert('marker: ' + e.marker);
    });
    this.mapwizeMap.addMarker({
      latitude: 9.975608076489635,
      longitude: -84.74990297623508,
      floor: 0,
    }, goMarker).then((marker => {

      var s = "";
    }));
    }
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.getUserLogged();
      this.getAlertAmount();
      MapwizeUI.map({
        apiKey: '439578d65ac560a55bb586feaa299bf7',
        hideMenu: true,
        floor: 0,
        centerOnVenue: '5de813dcc85b5500169609d6'

      }).then(instance => {
        this.mapwizeMap = instance;

        //this.personLocation();
        //this.personLoggedLocation();
        //this.asociatedPersonLocation();
        this.timer();
        this.timerBeacons();
        //this.timerDoBinary();
        this.timerWayFinding();

        //Metodo de prueba para las rutas de los tiquetes...
        this.setRoute();
      });
    }, 1000);

    this.getBeaconsPointLocal();

  }//fin de after

  //Metodo que coloca el marcador y el popup de la persona loggeada
  personLocation() {
    this.mapwizeMap.removeMarkers();
    const myCustomMarker = new mapboxgl.Marker({ color: '#C51586' });
    myCustomMarker.setPopup(new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false
    }).setHTML('<h4>' + this.person.person.name + '</h4><p>' + "Punto: " + this.pointDesc + '<br>' + "Tiempo: " + this.secondSpended + '</p>'));

    this.mapwizeMap.on('mapwize:markerclick', e => {
      alert('marker: ' + e.marker);
    });
    this.mapwizeMap.addMarker({
      latitude: this.lastBeaconsLat,
      longitude: this.lastBeaconsLong,
      floor: 0,
    }, myCustomMarker).then((marker => {

      var s = "";
    }));
  }

  assignedPersonLocation() {
    const myCustomMarker = new mapboxgl.Marker({ color: 'yellow' });
    myCustomMarker.setPopup(new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false
    }).setText('Nombre persona asignada'));

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

    var dir = {
      "from": { "placeId": "5d7448f0ce095b0051f9aa3d" },
      "to": { "placeId": "5d74287f731b47002c23c6e9" },
      "options": { "isAccessible": false }
    };

    this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
      this.mapwizeMap.setDirection(response);
    }, (err) => {

      console.error(err);
    });
  }

  go() {
    this.router.navigateByUrl('/menu/third');
  }

  times = {
    year: 31557600,
    mes: 2629746,
    dia: 86400,
    h: 3600,
    m: 60,
    s: 1
  }

  transform(seconds) {
    let time_string: string = '';
    let plural: string = '';
    for (var key in this.times) {
      if (Math.floor(seconds / this.times[key]) > 0) {
        if (Math.floor(seconds / this.times[key]) > 1) {
          plural = 's';
        }
        else {
          plural = '';
        }

        time_string += Math.floor(seconds / this.times[key]).toString() + ' ' + key.toString() + plural + ' ';
        seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);

      }
    }
    return time_string;
  }
  //inicia metodos relacionados a la lectura de beacons

  //se está actualizando cada cierto tiempo
  timerBeacons() {
    this.interval = setInterval(() => {
      this.ScanBeaconsAll();

    }, 10000);
  }
  timerDoBinary() {
    setTimeout(() => {
      this.interval = setInterval(() => {

        this.doBinary();
      }, 11000);
    }, 3000);
  }
  timerWayFinding() {
    this.interval = setInterval(() => {
      this.testWayFinding();
    }, 12000);
  }
  //scanea todos los bluetooth de baja carga con los rssi
  ScanBeaconsAll() {
    this.devices = [];
    this.ble.scan([], 15).subscribe(
      device => this.onDeviceDiscovered(device)

    );

  }//fin del metodo scan

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
      this.devices.push(device);
      console.log(device);
      this.doBinary();
    })

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

    let items = [];
    for (let i = 0; i < this.beaconsPoints.length; i++) {
      items.push(this.beaconsPoints[i].shortid);
    }
    console.log(items);
    //let items = ["aguacate", "adriel", "tavo", "jairazo"];
    //console.log(this.devices[0].id);

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

        var bdata = {
          id: this.devices[i].id,
          rssi: this.devices[i].rssi

        }
        bdataArray.push(bdata);


        //sorted.reverse();
      }//fin de if
    }
    bdataArray.sort((a, b) => a.rssi - b.rssi);
    bdataArray.reverse();

    console.log(beaconsId);
    console.log(value);
    console.log(index);
    console.log(lastFive);
    console.log(bdataArray);


    this.storeService.localSave(this.localParam.localParam.lastBeacon, bdataArray[0]);
    console.log("entra al if del getLastBeacon");

    //let value = beaconsId[0].replace(/:/g, "");

    // let lastFive =value.substr(value.length - 4);
    // let index = this.binarySearch(items, value);
    //>
    //<




  }//fin del dobinary
  testWayFinding() {

    this.getLastBeacon();
    let point;
    let beaconMac;
    let index;
    let value;
    let items = [];
    let shortMac;
    console.log(this.lastBeacon);
    for (let i = 0; i < this.beaconsPoints.length; i++) {
      items.push(this.beaconsPoints[i].shortid);
    }
    beaconMac = this.lastBeacon.id;
    shortMac = beaconMac.replace(/:/g, "");
    value = shortMac.substr(shortMac.length - 5);
    index = this.binarySearch(items, value);
    console.log(value);
    console.log(index);

    if (index > -1) {
      this.pointDesc = this.beaconsPoints[index].point.description;
      this.trackBeacons=this.beaconsPoints[index].point.externalid;
      this.lastBeaconsLat = Number(this.beaconsPoints[index].point.lat);
      this.lastBeaconsLong = Number(this.beaconsPoints[index].point.lon);
      this.personLocation();
      this.mapwizeMap.flyTo({
        center: {lon: this.lastBeaconsLong, lat: this.lastBeaconsLat},
        zoom: 18,
      });
    }
    //this.personLocation();

  }
  //Fin de los metodos de la lectura de beacons
}// fin
