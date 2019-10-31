import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BeaconModel, BeaconService } from '../services/beacon.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Platform, Events } from '@ionic/angular';

@Component({
  selector: 'app-see-people',
  templateUrl: './see-people.page.html',
  styleUrls: ['./see-people.page.scss'],
})
export class SeePeoplePage implements OnInit, AfterViewInit{

  
  devices:any[] = [];
  beacons: BeaconModel[] = [];
  serviceUUID="C2:46:F9:66:19:CD";
zone: any;
  constructor(private ble:BLE,private ngZone: NgZone,public beaconService:BeaconService, public platform: Platform,public events: Events) { 
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {
  
  }

  ngAfterViewInit(){
this.Scan();
//this.ionViewDidLoad();
  }
  Scan(){
    this.devices = [];
    this.ble.connect(this.serviceUUID).subscribe(
      device => this.onDeviceDiscovered(device)
      
    );
  }


  onDeviceDiscovered(device){
    
    console.log('Discovered' + JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device)
      console.log(device)
    })
  }

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
   
}//fin de la class
