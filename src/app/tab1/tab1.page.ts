import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AlertController, NavController, Platform, Events } from '@ionic/angular';
import { from } from 'rxjs';
import { BeaconService, BeaconModel } from '../services/beacon.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';


//declare var require:any;
//const Mapwize = require('mapwize');
declare var MapwizeUI : any;
@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
 
  beacons: BeaconModel[] = [];
zone: any;

  constructor(public beaconService:BeaconService, public platform: Platform,public events: Events) { 
  

    //Mapwize.apiKey("439578d65ac560a55bb586feaa299bf7");
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    MapwizeUI.map({
      apiKey: '439578d65ac560a55bb586feaa299bf7',
      hideMenu: true,
      centerOnVenue: '5d7420b31a255c0050e14fc5',
      /*direction: {
        "from" : {
          "placeId" : "5d7448f0ce095b0051f9aa3d"
        },
        "to" : {
          "placeId" : "5d744895ce095b0051f9aa3b"
        },
        "options" : {
          "isAccessible" : true
        }
      } */
    }).then(function(instance) {
      const mapwizeMap = instance;

      mapwizeMap.addMarker({
        latitude: 9.97500008644451,
        longitude: -84.7521220445736,
        floor: 0
      });
      
    });
    

this.ionViewDidLoad();
}//fin de after

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

}// fin
