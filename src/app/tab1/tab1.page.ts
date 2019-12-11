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

//declare var require:any;
//const Mapwize = require('mapwize');
declare var MapwizeUI: any;


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
  pages=[
    { title: 'Notificacion',
      url:'notification/third'
  },];

  beacons: BeaconModel[] = [];
  zone: any;
  mapwizeMap: any;
  person: any;
  alertAmount: any;
  isTest: boolean=true;
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
    private modalController:ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController) {

    //Mapwize.apiKey("439578d65ac560a55bb586feaa299bf7");
    this.zone = new NgZone({ enableLongStackTrace: false });

  }

  ngOnInit() {
    //Obtener el id de la url
    this.urlId = this.route.snapshot.paramMap.get("id");
    //console.log("EL ID DE LA RUTA ES: "+this.urlId);
  }

  //Metodo que busca el id de la persona loggeada para obtener la informacion.
  personLoggedLocation(){
    this.service.get(this.params.params.beaconurl+"/tracker/person/alert/"+this.person.person.id).subscribe((resp) => {
        this.trackerLogged = resp;
        this.loggedPersonAlert = this.trackerLogged.alerts;
        this.loggedPersonInfor = this.trackerLogged.summary;
        this.loggedLatitude = Number(this.loggedPersonInfor.Point.lat);
        this.loggedLongitude = Number(this.loggedPersonInfor.Point.lon);
        this.loggedPlaceId = this.loggedPersonInfor.Point.externalid;
        console.log(this.loggedPlaceId);
        let secondSpended = this.transform(this.loggedPersonInfor.secondsspended);
        let desc = this.loggedPersonInfor.Point.description;
        this.personLocation(secondSpended, desc);
      }, (err) => {
        console.error(err);
      });
  }

  //Metodo que busca el id de la persona asociada para obtener su informacion
  asociatedPersonLocation(){
    if(this.urlId != 0){
      this.service.get(this.params.params.beaconurl+"/tracker/person/alert/"+this.urlId).subscribe((resp) => {
        this.trackerPerson = resp;
        this.personAlerts = this.trackerPerson.alerts;
        this.personInfo = this.trackerPerson.summary;
        let lat = Number(this.personInfo.Point.lat);
        let lon = Number(this.personInfo.Point.lon);
        let desc = this.personInfo.Point.description;
        let place = String(this.personInfo.Point.externalid);
        console.log(place);
        console.log(this.trackerPerson);
        this.asociatedPersonTime = this.transform(this.personInfo.secondsspended);
        this.setAsociatedPersonPoint(lat, lon, desc, place);
      }, (err) => {
        console.error(err);
      });
    }
  }

  //Metodo que revisa si la persona asociada tiene alertas
  haveAlerts(){
    if(this.personAlerts === null){
      this.asociatedAlerts = "No hay alertas que revisar";
    }
    else if(this.personAlerts.length < 1){
      for(let i = 0; i < this.trackerPerson.alerts.length; i++){
        if(this.personAlerts[i].isResolved == false){
          this.asociatedAlerts = "Hay alertas que revisar";
        }
      }
    }else if(this.personAlerts.isResolved == false){
      this.asociatedAlerts = "Hay alertas que revisar";
    }
  }

  //Metodo que pone el punto de la persona asociada en el mapa
  setAsociatedPersonPoint(lat, lon, desc, place: string){
    for(let i = 0; i < this.person.asocietedpeople.length; i++){
      if(this.person.asocietedpeople[i].id == this.urlId){
        this.asocietedName = this.person.asocietedpeople[i].name;
      }
    }

    //Metodo que revisa si la persona asociada tiene alertas
    this.haveAlerts();

    const myCustomMarker = new mapboxgl.Marker({color: 'blue'});
      myCustomMarker.setPopup(new mapboxgl.Popup({
        closeOnClick: false, 
        closeButton: false
      }).setHTML('<h4>' + this.asocietedName + '</h4><p>' + "Punto: " + desc + 
      '<br>' + "Tiempo: "+ this.asociatedPersonTime + '<br>' + "Alertas: " + this.asociatedAlerts + '</p>'));
      
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
      if(this.loggedPlaceId != "0" && place != "0"){
        var dir  = { 
          "from": {  "lat": this.loggedLatitude,
          "lon": this.loggedLongitude,
          "placeId": this.loggedPlaceId }, 
          "to": {
            "lat": lat,
            "lon": lon,
          "placeId": place },
          "options": { "isAccessible": false } };
  
        this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
          this.mapwizeMap.setDirection(response);
        }, (err) => {
    
          console.error(err);
        });
      }else{
        this.presentActionSheet();
      }
  }

  //Popup cuando la persona asociada no tiene registros
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Persona asociada no presenta registros',
      buttons: [{
        text: 'La persona asociada no presenta registro desde: '+this.asociatedPersonTime,
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  //metodo para actualizar la ubicacion de la persona asociada
  timer() {
    this.interval = setInterval(() => {
      if (this.urlId != null) {
        this.asociatedPersonLocation();
      }
    }, 40000);
  }
 


  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      //console.log(this.person);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para obtener las alertas desde el Storage local
  getAlertAmount(){
    this.storeService.localGet(this.localParam.localParam.alerts).then((resp) => {
      this.alertAmount = resp;

    }, (err) => {
      console.error(err);
    });
  }

  setVibration(){
    navigator.vibrate([500, 500, 500]);
    
    console.log(this.person.name);
    console.log(this.person.identifier);
    console.log(this.person.personasocieted);
  }

  setRoute() {
    var dir  = { 
        "from": { "placeId": "5d7448f0ce095b0051f9aa3d" }, 
        "to": { "placeId": "5d8e6bb4478407002c9ff811" },
        "options": { "isAccessible": false } };

    this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
      this.mapwizeMap.setDirection(response);
    }, (err) => {

      console.error(err);
    });
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
        this.personLoggedLocation();
        this.asociatedPersonLocation();
      });
    }, 1000);
    
  }//fin de after

  //Metodo que coloca el marcador y el popup de la persona loggeada
  personLocation(secondSpended, desc){
    const myCustomMarker = new mapboxgl.Marker({color: 'red'});
      myCustomMarker.setPopup(new mapboxgl.Popup({
        closeOnClick: false, 
        closeButton: false
      }).setHTML('<h4>' + this.person.person.name + '</h4><p>' + "Punto: " + desc + '<br>' + "Tiempo: " + secondSpended +'</p>'));
      
      this.mapwizeMap.on('mapwize:markerclick', e => {
        alert('marker: ' + e.marker);
      });
      this.mapwizeMap.addMarker({
        latitude: this.loggedLatitude,
        longitude: this.loggedLongitude,
        floor: 0,
      }, myCustomMarker).then((marker => {

        var s = "";
      }));
  }

  assignedPersonLocation(){
    const myCustomMarker = new mapboxgl.Marker({color: 'yellow'});
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

    var dir  = { 
      "from": { "placeId": "5d7448f0ce095b0051f9aa3d" }, 
      "to": { "placeId": "5d74287f731b47002c23c6e9" },
      "options": { "isAccessible": false } };

      this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
        this.mapwizeMap.setDirection(response);
      }, (err) => {

        console.error(err);
      });
  }

  go(){
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
}// fin
