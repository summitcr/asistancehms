import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Events, Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';

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
  tracker: string = "Personas Asociadas";

  constructor(public platform: Platform, public events: Events, private ibeacon: IBeacon,private toast: Toast) { }//fin del contructor

  alert(msg: string){
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );    
  }
  initialise(): any {
    //this.alert("Entro al ini");
    let promise = new Promise((resolve, reject) => {
      //this.alert("Entro al promise");
      /* we need to be running on a device */
      if (this.platform.is('cordova')) {    
        //this.alert("Entro al if linea 42");
        /* Request permission to use location on iOS */
        this.ibeacon.requestAlwaysAuthorization();
        //this.alert("Entro la linea 46"+this.ibeacon);
        /* create a new delegate and register it with the native layer */
        this.delegate = this.ibeacon.Delegate();
        //this.alert("Entro la linea 49");
        /* Subscribe to some of the delegate's event handlers */
        this.delegate.didRangeBeaconsInRegion().subscribe( data => {
          console.log("Ranging result: "+JSON.stringify(data));
          //this.alert("Entro la linea 52");
          this.events.publish('didRangeBeaconsInRegion', data);
          //this.alert("Entro la linea 55");
        }, error => 
          this.alert(error)
        );
        
        /* setup a beacon region – remove any special characters or else the plugin will not work.
          https://www.beautifyconverter.com/uuid-validator.php


          beacons de tavo: f7826da6-4fa2-4e98-8024-bC5b71e0893e

          posible beacons: 00002A00-0000-1000-8000-00805F9B34FB

          segundo posible beacons: 00112233-4455-6677-8899-AABBCCDDEEFF

          tercer posible 01120011-2233-4455-6677-8899aabbccdd
        */
        this.region = this.ibeacon.BeaconRegion('deskBeacon', '00002A00-0000-1000-8000-00805F9B34FB');
        
        this.alert(`Scanning has started`);

        /* start ranging */
        this.ibeacon.startRangingBeaconsInRegion(this.region).then(() => {
          //this.alert("Entro la linea 69");
          resolve(true);
        }, error => {
          this.alert(`Failed to begin monitoring: ${error}`);
          resolve(false);
        });
      } else {
        this.alert(`This application needs to be running on a device`);
        resolve(false);
      }
    });
    return promise;
    }
    
  
}//fin de la class
