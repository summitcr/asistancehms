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
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => console.log('didRangeBeaconsInRegion: ', data),
        error => console.error()
      );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => console.log('didStartMonitoringForRegion: ', data),
        error => console.error()
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', data);
        }
      );
    
    let beaconRegion = this.ibeacon.BeaconRegion('deskBeacon','00112233-4455-6677-8899-AABBCCDDEEFF');
    
    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
    }
    
  
}//fin de la class
