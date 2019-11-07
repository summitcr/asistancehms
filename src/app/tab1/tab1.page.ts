import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AlertController, NavController, Platform, Events } from '@ionic/angular';
import { from } from 'rxjs';
import { BeaconService, BeaconModel } from '../services/beacon.service';
import { UtilsService } from '../services/utils.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { CrudService } from '../services/crud.service';

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

  constructor(private service: CrudService, public beaconService: BeaconService, public platform: Platform, public events: Events, public services: UtilsService) {


    //Mapwize.apiKey("439578d65ac560a55bb586feaa299bf7");
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {

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

   MapwizeUI.map({
      apiKey: '439578d65ac560a55bb586feaa299bf7',
      hideMenu: true,
      centerOnVenue: '5d7420b31a255c0050e14fc5'

    }).then(instance => {
      this.mapwizeMap = instance;
      return instance;
  });


    
  }//fin de after



}// fin
