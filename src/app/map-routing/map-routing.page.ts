import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AzureRoutesService } from '../services/azure-routes.service';
import { Router } from '@angular/router';

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
  infoWindow = new google.maps.InfoWindow({
    content: null,
  });
  polyline = new google.maps.Polyline({
    map: null,
    strokeColor: '#1a73e8',
    visible: false
  });
  centroAdscripcion: any;

  centrosLocations = {
    "Hospital Monseñor Sanabria": {
      lat:9.974475,
      long:-84.752396
    },
    "Clinica Barranca": {
      lat:9.979787,
      long:-84.722653
    },
    "Clinica San Rafael": {
      lat:9.975295,
      long:-84.836127
    }
  }

  centerLatLong: {
    lat: number,
    long: number, 
  }

  constructor(
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private platform: Platform,
    private service:AzureRoutesService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.getNavigationData();
    if (this.platform.is("cordova")) {
      await this.checkGPSPermission();
      await this.getInitialPosition();
      this.loadMap();
    }else {
      await this.getInitialPosition();
      this.loadMap();
    }
  }

  ionViewWillLeave() {
    this.watcher.unsubscribe();
  }

  getNavigationData(){
    const navigationState = this.router.getCurrentNavigation().extras.state;
    if (
      navigationState !== undefined && navigationState !== null &&
      navigationState.data.centro !== undefined && navigationState.data.centro !== null
    ) {
      this.centroAdscripcion = navigationState.data.centro;
      this.getCenterLatLong();
      console.log(this.centroAdscripcion);
    } else {
      this.centroAdscripcion = "No se encontro un centro de adscripcion";
    }
  }

  getCenterLatLong(){
    if(this.centroAdscripcion == "Hospital Monseñor Sanabria"){
      this.centerLatLong = this.centrosLocations["Hospital Monseñor Sanabria"];
    } else if(this.centroAdscripcion == "Clinica Barranca"){
      this.centerLatLong = this.centrosLocations["Clinica Barranca"];
    } else if(this.centroAdscripcion == "Clinica San Rafael"){
      this.centerLatLong = this.centrosLocations["Clinica San Rafael"];
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
      maxZoom: 17,
      minZoom:10,
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

  showRoute() {
    const {lat, long: lng} = this.centerLatLong
    const routeQuery = `${this.currentPosition.lat},${this.currentPosition.lng}:${lat},${lng}`;
    // if (card.path) {
    //   console.log('entro sin pedir');
    //   this.polyline.setMap(this.map);
    //   this.polyline.setPath(card.path);
    //   this.map.fitBounds(card.bounds, { bottom: 60 });
    // } else {
    //   console.log('entro para pedir');
    //   this.getRoute(routeQuery);
    // }
    this.getRoute(routeQuery);
    // this.showAgencies();
    this.polyline.setVisible(true);
    this.infoWindow.map = null;
    this.infoWindow.close();
  }

  getRoute(routeQuery) {
    this.service.getRoute(routeQuery)
      .toPromise().then((data: any) => {

        const pathArray = data.routes[0].legs[0].points;
        const googleArray = new google.maps.MVCArray();
        const bounds = new google.maps.LatLngBounds();

        pathArray.forEach((point: any) => {
          const latLng = new google.maps.LatLng(point.latitude, point.longitude);
          googleArray.push(latLng);
          bounds.extend(latLng);
        });
        // -------------------------- //
        // card.bounds = bounds;
        // card.path = googleArray;
        // console.log(card);
        this.polyline.setMap(this.map);
        this.polyline.setPath(googleArray);
        this.map.fitBounds(bounds, { bottom: 40 });
      }).catch(error => console.error(error));
  }

}
