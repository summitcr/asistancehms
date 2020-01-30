import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit, AfterViewInit {

  points: any;
  tickets: any;
  platfrom: any;
  scanSub: any;
  asociatedId: any;
  asociatedIdAlert: any;
  bellAlert: number = 0;
  ticketNumber: string = "v777";
  ticketName: string= "Jairo García";
  ticketUbi: string= "Entrada Principal";
  ticketDesti: string= "Pasillo Mujeres Norte";
  person: any;
  beaconsPoints: any;
  lastBeacon: any;
  timeLeft: number = 60;
  interval;

  constructor(private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService, 
    private qrScanner: QRScanner,
    private toast: Toast,
    private router: Router)
   {

   }

  ngOnInit() {
    //this.getInfoTickets();
    this.getTicketInfo();
    this. getTicketName();
    this. getTicketUbi();
    this.getTicketDesti();
  }

  ngAfterViewInit(){
    
    setTimeout(() => {
      //this.getBeaconsPointLocal();
      //this.getLastBeacon();
      this.getUserLogged();
      this.getAsociatedId();
      this.getAsociatedAlerts();
      //this.getUserPosition();
    }, 1000);
  }

  getTicketInfo(){
    if(this.ticketNumber != ""){
      this.setVibration();
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
          //console.log(this.timeLeft);
          if(this.timeLeft == 30){
            this.alert("Faltan 30 segundos");
            console.log("Faltan 30 segundos");
          }
        } else {
          this.timeLeft = 60;
        }
      },1000)
    }
  }
  getTicketName(){
    if(this.ticketName != ""){
      this.setVibration();
    }
  }
  getTicketUbi(){
    if(this.ticketUbi != ""){
      this.setVibration();
    }
  }
  getTicketDesti(){
    if(this.ticketDesti != ""){
      this.setVibration();
    }
  }

  setVibration(){
    navigator.vibrate([500, 500, 500]);
    console.log("Esta vibrando");
  }

  go(id) {
    this.router.navigateByUrl('/menu/first/tabs/tab1/'+'5df0825d1bb18c001609e8e4');
  }

  goNotification() {
    this.router.navigateByUrl('menu/third');
  }

  //Metodo que trae los datos del usuario loggeado de manera local
  getUserLogged() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      this.ticketName = this.person.person.name;
      //console.log(this.person);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que trae los beacons guardados de manera local
  getBeaconsPointLocal() {
    this.storeService.localGet(this.localParam.localParam.gatewaybeacons).then((resp) => {
      this.beaconsPoints = resp;
      console.log(this.beaconsPoints);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que trae el ultimo beacon detectado
  getLastBeacon() {
    this.storeService.localGet(this.localParam.localParam.lastBeacon).then((resp) => {
      this.lastBeacon = resp;
    }, (err) => {
      console.error(err);
    });
  }

  getAsociatedId(){
    this.storeService.localGet(this.localParam.localParam.alertsId).then((resp) => {
      this.asociatedId = resp;
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que saca las alertas, si sale null es porque alguno no tiene alertas y viene null
  getAsociatedAlerts(){
    //let asociatedId = [];
    let id;
    for(let i = 0; i < this.asociatedId.length; i++){
      id = this.asociatedId[i];
      //asociatedId.push(id);
      this.services.get(this.params.params.beaconurl+"/tracker/person/alert/"+id).subscribe((resp) => {
        this.asociatedIdAlert = resp;
        if(this.asociatedIdAlert.alerts.length < 1){
          for(let x = 0; x < this.asociatedIdAlert.alerts.length; x++){
            if(this.asociatedIdAlert.alerts[i].isResolved == false){
              this.bellAlert ++;
              this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
            }
          }
        }else if(this.asociatedIdAlert.alerts.isResolved == false){
          this.bellAlert ++;
          this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
        }
        //this.storeService.localSave(this.localParam.localParam.alertsId, asociatedId);
      }, (err) => {
        console.error(err);
      });
    }
  }

  alert(msg: string){
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );    
  }

  //Metodo de prueba del api de los tiquetes
  getInfoTickets() {
    this.services.getTicket('http://35.184.70.184:9090/MobileTicket/branches/1/services').subscribe((resp) => {
      this.tickets = resp;
      console.log(this.tickets);
    }, (err) => {
      console.error(err);
    });
  }

  QR() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          document.getElementsByTagName("body")[0].style.opacity = "0";
          this.qrScanner.show();
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            document.getElementsByTagName("body")[0].style.opacity = "1";
           this.alert('Scanned something'+ text);

            this.qrScanner.hide(); // hide camera preview
            this.scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  binarySearch(items, value) {
    let startIndex = 0,
      stopIndex = items.length - 1,
      middle = Math.floor((stopIndex + startIndex) / 2);

    while (items[middle] != value && startIndex < stopIndex) {

      //adjust search area
      if (value < items[middle]) {
        stopIndex = middle - 1;
      } else if (value > items[middle]) {
        startIndex = middle + 1;
      }

      //recalculate middle
      middle = Math.floor((stopIndex + startIndex) / 2);
    }

    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
  }

  //Metodo que busca la posicion del usuario loggeado segun el ultimo beacon leido
  getUserPosition() {
    let beaconMac;
    let index;
    let value;
    let items = [];
    let shortMac;

    for (let i = 0; i < this.beaconsPoints.length; i++) {
      items.push(this.beaconsPoints[i].shortid);
    }

    beaconMac = this.lastBeacon.id;
    shortMac = beaconMac.replace(/:/g, "");
    value = shortMac.substr(shortMac.length - 5);
    index = this.binarySearch(items, value);

    if (index > -1) {
      this.ticketUbi = this.beaconsPoints[index].point.description;
    }
  }


}//fin de la classs tab2
