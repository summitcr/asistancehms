import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Events, Platform } from '@ionic/angular';

export class BeaconModel {
  uuid: string;
  major: number;
  minor: number;
  rssi: number;
  
  constructor(public beacon: any) {
    this.uuid  = beacon.uuid;
    this.major = beacon.major;
    this.minor = beacon.minor;
    this.rssi  = beacon.rssi;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BeaconService {
  delegate: any;
  region: any;


  constructor(public platform: Platform, public events: Events, private ibeacon: IBeacon) { }//fin del contructor


  initialise(): any {
    let promise = new Promise((resolve, reject) => {
    // we need to be running on a device
    if (this.platform.is('cordova')) {
    
    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    
    // create a new delegate and register it with the native layer
    this.delegate = this.ibeacon.Delegate();
    
    // Subscribe to some of the delegate’s event handlers
    this.delegate.didRangeBeaconsInRegion()
    .subscribe(
    data => {
    this.events.publish('didRangeBeaconsInRegion', data);
    },
    error => console.error()
    );
    
    // setup a beacon region – CHANGE THIS TO YOUR OWN UUID
    this.region = this.ibeacon.BeaconRegion('deskBeacon', '00112233-4455-6677-8899-AABBCCDDEEFF');
    
    // start ranging
    this.ibeacon.startRangingBeaconsInRegion(this.region).then(() => {
    resolve(true);
  },error => {
    console.error('Failed to begin monitoring: ', error);
    resolve(false);
    }
    );
    } else {
    console.error('This application needs to be running on a device');
    resolve(false);
    }
    });
    
    return promise;
    }
    
  
}//fin de la class
