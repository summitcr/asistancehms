import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  ticketNumber: string;
  ticketName: any;
  ticketUbi: string;
  ticketDesti: string;
  NumberPosition: string;
  person: any;
  beaconsPoints: any;
  lastBeacon: any;
  timeLeft: number = 60;
  content: String;
  getSymptoms: any;
  getAnotherCases: any;
  generatedServices: any;
  createdTicket: any;
  ticketStatus: any;
  ticketPosition: any;
  refreshedTicket: any;
  popUp: any;
  stopPopUp = false;
  interval;

  constructor(private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private qrScanner: QRScanner,
    private toast: Toast,
    private router: Router,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

  }

  ngOnInit() {
    //this.getTicketInfo();
    //this. getTicketName();
    //this. getTicketUbi();
    //this.getTicketDesti();
    this.GenerateServices();
  }

  ngAfterViewInit() {

    this.getAsociatedId();
    setTimeout(() => {
      //this.getBeaconsPointLocal();
      //this.getLastBeacon();
      //this.getUserLogged(); es bueno
      this.getAsociatedAlerts();
      this.getTicketName();
      //this.getUserPosition();
      this.presentLoadingDefault();
    }, 1000);
    setTimeout(() => {
      this.getTicketInfo();
      this.getTicketUbi();
      this.getTicketDesti();
      this.getTicketPosition();
      this.timer();
    }, 5000);
  }

  //Metodo que crea los servicios para crear un tiquete
  GenerateServices(){
    this.services.saveTicket(this.params.params.ticketServices, null).subscribe((resp) => {
      this.generatedServices = resp;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.generatedServices);

      console.log(this.generatedServices);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para el numero del tiquete
  getTicketInfo() {
    /*if (this.ticketNumber != "") {
      this.ticketNumber = "A36";
      this.setVibration();
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          //console.log(this.timeLeft);
          if (this.timeLeft == 30) {
            //this.alert("Faltan 30 segundos");
            console.log("Faltan 30 segundos");
          }
        } else {
          this.timeLeft = 60;
        }
      }, 1000)
    }*/
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.createdTicket = resp;
      if(!this.createdTicket){
        this.ticketNumber = "No hay tiquete";
      }else if(this.createdTicket){
        this.ticketNumber = this.createdTicket.ticketNumber;
        this.setVibration();
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que pone el nombre de la persona en el tiquete
  getTicketName() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      if(!this.person){
        this.ticketName = "Inicie sesión";
      }else if(this.person){
        this.ticketName = this.person.person.name;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para poner la ubicacion del tiquete
  getTicketUbi() {
    this.storeService.localGet(this.localParam.localParam.ticketStatus).then((resp) => {
      this.ticketStatus = resp;
      if(!this.ticketStatus){
        this.ticketUbi = "No se ha creado un ticket.";
      }else if(this.ticketStatus){
        this.ticketUbi = this.ticketStatus.queueName;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para poner el destino del tiquete
  getTicketDesti() {
    this.storeService.localGet(this.localParam.localParam.ticketStatus).then((resp) => {
      this.ticketStatus = resp;
      if(!this.ticketStatus){
        this.ticketDesti = "No se ha creado un ticket.";
      }else if(this.ticketStatus){
        this.ticketDesti = this.ticketStatus.currentServiceName;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para saber cuantas personas hay en la fila
  getTicketPosition() {
    this.storeService.localGet(this.localParam.localParam.ticketStatus).then((resp) => {
      this.ticketStatus = resp;
      if(!this.ticketStatus){
        this.ticketPosition = "No se ha creado un ticket.";
      }else if(this.ticketStatus){
        this.ticketPosition = this.ticketStatus.position+" personas adelante";
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Revisa si existe un tiquete creado, si existe hace un get del tiquete nuevamente para refrescarlo
  refreshTicket(){
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.createdTicket = resp;
      if(this.createdTicket){
        let visitId = this.createdTicket.visitId;
        let checksum = this.createdTicket.checksum;
        this.services.get(this.params.params.ticketStatus+'/visitId/'+visitId+'/checksum/'+checksum).subscribe((resp) => {
          this.refreshedTicket = resp;
          this.ticketPosition = this.refreshedTicket.position+" personas adelante";
          let calledFrom = this.refreshedTicket.servicePointName;
          if(this.refreshedTicket.position == null){
            this.ticketPosition = 0+"personas adelante";
            if (!this.stopPopUp) {
              //this.stopPopUp = true;
              if(this.popUp == null){
                this.presentAlert(calledFrom);
                
                this.setVibration();
               
              }else if(this.popUp != null){
                this.popUp.dismiss();
                this.presentAlert(calledFrom);
              }
            }
          }
          this.ticketNumber = this.refreshedTicket.ticketId;
          //this.ticketDesti = this.refreshedTicket.queueName;
          console.log(this.refreshedTicket);
        }, (err) => {
          if(err.status == 404){
            this.ticketNumber = "Atendido";
            this.ticketPosition = 0+" personas adelante";
          }
        });
      }
    }, (err) => {
      console.error(err);
    });
  }

  timer() {
    this.interval = setInterval(() => {
      this.refreshTicket();
    }, 10000);
  }
  setVibration() {
    navigator.vibrate([500, 500, 500]);
    console.log("Esta vibrando");
  }

  go(id) {
    this.presentLoadingDefaults();
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + '5df081fbcfc8cf0016d9eaa5');
  }

  goNotification() {
    this.router.navigateByUrl('menu/third');
  }

  //Metodo que trae los datos del usuario loggeado de manera local
  getUserLogged() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      //this.ticketName = this.person.person.name;
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

  getAsociatedId() {
    this.storeService.localGet(this.localParam.localParam.alertsId).then((resp) => {
      this.asociatedId = resp;
      console.log(this.asociatedId);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que saca las alertas, si sale null es porque alguno no tiene alertas y viene null
  getAsociatedAlerts() {
    //let asociatedId = [];
    let id;
    console.log(this.asociatedId);
    for (let i = 0; i < this.asociatedId.length; i++) {
      id = this.asociatedId[i];
      //asociatedId.push(id);
      this.services.get(this.params.params.beaconurl + "/tracker/person/alert/" + id).subscribe((resp) => {
        this.asociatedIdAlert = resp;
        if (this.asociatedIdAlert.alerts.length < 1) {
          for (let x = 0; x < this.asociatedIdAlert.alerts.length; x++) {
            if (this.asociatedIdAlert.alerts[i].isResolved == false) {
              this.bellAlert++;
              this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
            }
          }
        } else if (this.asociatedIdAlert.alerts.isResolved == false) {
          this.bellAlert++;
          this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
        }
        //this.storeService.localSave(this.localParam.localParam.alertsId, asociatedId);
      }, (err) => {
        console.error(err);
      });
    }
  }

  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
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
            this.alert('Scanned something' + text);

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

  //alert
  async presentLoadingDefault() {
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
  async presentLoadingDefaults() {
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }


  async presentAlert(calledFrom) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: '',
      message:
      'It is your turn, please go to: '+ calledFrom,
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          console.log('you clicked me');
        }
      },
      ]
    });
    await alert.present();
  }


}//fin de la classs tab2
