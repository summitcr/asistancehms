import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AlertController, NavController, Platform, Events, ModalController } from '@ionic/angular';
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
    { title: 'Home',
  url:'/menu/third'
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
    private route: ActivatedRoute,) {

    //Mapwize.apiKey("439578d65ac560a55bb586feaa299bf7");
    this.zone = new NgZone({ enableLongStackTrace: false });

  }

  ngOnInit() {
    this.urlId = this.route.snapshot.paramMap.get("id");
    console.log("EL ID DE LA RUTA ES: "+this.urlId);
  }

  asociatedPersonLocation(){
    if(this.urlId != 0){
      this.service.get(this.params.params.beaconurl+"/tracker/person/"+this.urlId).subscribe((resp) => {
        this.trackerPerson = resp;
        console.log(this.trackerPerson);
        var lat = Number(this.trackerPerson.Point.lat);
        var lon = Number(this.trackerPerson.Point.lon);
        var desc = this.trackerPerson.Point.description;
        this.setAsociatedPersonPoint(lat, lon, desc);
      }, (err) => {
        console.error(err);
      });
    }
  }

  setAsociatedPersonPoint(lat, lon, desc){
    const myCustomMarker = new mapboxgl.Marker({color: 'blue'});
      myCustomMarker.setPopup(new mapboxgl.Popup({
        closeOnClick: false, 
        closeButton: false
      }).setText(desc));
      
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

      var dir  = { 
        "from": {  "lat": 9.975285088159453,
        "lon": -84.74990448755439,
        "placeId": "5d7448f0ce095b0051f9aa3d" }, 
        "to": {
          "lat": lat,
          "lon": lon,
        "placeId": "5d7448022ea497002c7a94a9" },
        "options": { "isAccessible": false } };

    this.service.save(this.services.mapwizeParams.searchdirection, dir).subscribe((response) => {
      this.mapwizeMap.setDirection(response);
    }, (err) => {

      console.error(err);
    });
  }

  timer() {
    this.interval = setInterval(() => {
      if (this.urlId != null) {
        this.asociatedPersonLocation();
      }
    }, 15000);
  }
 

ubicacion() {

    if (this.isTest == true) {
     this.setRoute();
      
    } else {
     
     
    }
  }
  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      
    }, (err) => {
      console.error(err);
    });
  }

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
        centerOnVenue: '5d7420b31a255c0050e14fc5'
  
      }).then(instance => {
        this.mapwizeMap = instance;
      
        this.personLocation();
        this.asociatedPersonLocation();
      
      });
    }, 1000);
    
  }//fin de after

  personLocation(){
    let el = document.createElement('div');
    el.className = 'marker';
    
    const myCustomMarker = new mapboxgl.Marker({color: 'red'});
      myCustomMarker.setPopup(new mapboxgl.Popup({
        closeOnClick: false, 
        closeButton: false
      }).setText(this.person.person.name));
      
      this.mapwizeMap.on('mapwize:markerclick', e => {
        alert('marker: ' + e.marker);
      });
      this.mapwizeMap.addMarker({
        latitude: 9.975285088159453,
        longitude: -84.74990448755439,
        floor: 0,
      }, myCustomMarker).then((marker => {

        var s = "";
      }));
  }

  assignedPersonLocation(){
    const myCustomMarker = new mapboxgl.Marker({color: 'yellow'});
      myCustomMarker.setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText('Nombre persona asignada'));
      
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
}// fin
