import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-map-routing',
  templateUrl: './map-routing.page.html',
  styleUrls: ['./map-routing.page.scss'],
})
export class MapRoutingPage implements OnInit {

  map = null;
  currentPosition = {
    lat: 15.506049,
    lng: -88.028020
  };
  blueDot = null;
  watcher;

  constructor(
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    if (this.platform.is("cordova")) {
      await this.checkGPSPermission();
      await this.getInitialPosition();
      this.loadMap();
    }else {
      await this.getInitialPosition();
      this.loadMap();
    }
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.currentPosition,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: false,
      scrollwheel: true,
      scaleControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });

    this.blueDot = new google.maps.Marker({
      position: this.currentPosition,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: '#1A73E8',
        strokeWeight: 4, 
        fillOpacity: 1.0,
        strokeColor: '#1A73E8',
        strokeOpacity: 0.3,
      },
      draggable: false,
      map: this.map
    });

    this.watchPosition();
  }

  watchPosition() {
    this.watcher = this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(resp => {
      if ("coords" in resp) {
        this.currentPosition = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };
        this.blueDot.setPosition(this.currentPosition);
      } else {
        console.log(resp.message)
      }
    });
  }

  async checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      async (result) => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          await this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        // alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then(async (canRequest: boolean) => {
      if (canRequest) {
        await this.askToTurnOnGPS()
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            async () => {
              // call method to turn on GPS
              await this.askToTurnOnGPS();
              console.log('entro');
            },
            async error => {
              //Show alert if user click on 'No Thanks'
              // alert('requestPermission Error requesting location permissions ' + error)
              console.log('error al solicitar permisos');
              console.log(error);
              await this.askToTurnOnGPS();
            }
          );
      }
    });
  }

  async askToTurnOnGPS() {
    const data = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    if (data.code == 1) {
      window.location.reload();
    }
  }

  async getInitialPosition() {
    const coords = (await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 1000 })).coords;
    this.currentPosition = {
      lat: coords.latitude,
      lng: coords.longitude
    };
  }

}
