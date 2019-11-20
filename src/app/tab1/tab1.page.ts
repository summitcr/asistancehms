import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AlertController, NavController, Platform, Events } from '@ionic/angular';
import { from } from 'rxjs';
import { BeaconService, BeaconModel } from '../services/beacon.service';
import { UtilsService } from '../services/utils.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { CrudService } from '../services/crud.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Storage } from '@ionic/storage';
import mapboxgl from 'mapbox-gl';
import { SeePeoplePage } from '../see-people/see-people.page';


//declare var require:any;
//const Mapwize = require('mapwize');
declare var MapwizeUI: any;


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {

  beacons: BeaconModel[] = [];
  zone: any;
  mapwizeMap: any;
  person: any;
  interval: any;

  constructor(private storage: Storage, private service: CrudService, public beaconService: BeaconService, public platform: Platform, public events: Events, public services: UtilsService, private seePeople: SeePeoplePage) {

    //Mapwize.apiKey("439578d65ac560a55bb586feaa299bf7");
    this.zone = new NgZone({ enableLongStackTrace: false });

  }

  ngOnInit() {
   
  }
  getStorage(){
    this.storage.get('wa-data').then((val) => {
      this.person = val;
      console.log(this.person);
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
      this.getStorage();
      MapwizeUI.map({
        apiKey: '439578d65ac560a55bb586feaa299bf7',
        hideMenu: true,
        centerOnVenue: '5d7420b31a255c0050e14fc5'
  
      }).then(instance => {
        this.mapwizeMap = instance;
      
        this.personLocation();
        this.seePeople.peopleLocation();
      });
    }, 1000);
    
  }//fin de after

  personLocation(){
    let el = document.createElement('div');
    el.className = 'marker';
    
    const myCustomMarker = new mapboxgl.Marker({color: 'red'});
      myCustomMarker.setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText(this.person.name));
      
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

}// fin
