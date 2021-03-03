import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { AlertController, IonRouterOutlet, LoadingController, MenuController, Platform } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { UtilsService } from '../services/utils.service';
import { Storage } from '@ionic/storage';
// import { Vibration } from '@ionic-native/vibration/ngx';
// import { RouterOutletService } from '../services/router-outlet-service.service';

declare var cordova;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  user = {
    identifier: "",
    name: ""
  };

  ticket: any;
  ticketServiceName = ""

  ticketPosition:any;

  maxProgressBar: number = 0;
  refreshedTicket: any;
  stopPositionPopUp = false;
  stopPopUp = false;
  positionPopUp: any;
  popUp: any;
  postPoneDisable: boolean;
  cancelDisable: boolean;
  ticketNumber: any;
  oldTicketPosition: any;
  exitDelay: any;
  intervalRefresher: any;
  ticketStatus:any;
  createdTicket: any;
  ticketUbi: string;
  ticketDesti: string;
  interval:any;
  lastPosition: any;

  constructor(
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private toast: Toast,
    private router: Router,
    private localNotificactions: LocalNotifications,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private storage: Storage,
    // private vibration: Vibration,
    // private routerOutletService: RouterOutletService,
    private routerOutlet: IonRouterOutlet
  ) {
    this.menuCtrl.enable(false);
    this.platform.ready().then(() => {
      this.localNotificactions.on('click').subscribe(res => {
        let msg = res.data ? res.mydata : '';


      });
      this.localNotificactions.on('trigger').subscribe(res => {
        let msg = res.data ? res.mydata : '';
        //this.showAlert(res.title, res.text, msg);

      });

      if (this.platform.is('cordova')) {
        cordova.plugins.backgroundMode.on('activate', () => {
          cordova.plugins.backgroundMode.disableWebViewOptimizations();
        });
      }
    });

    // if (this.platform.is('cordova')) {
    //   cordova.plugins.backgroundMode.on('activate', () => {
    //     cordova.plugins.backgroundMode.disableWebViewOptimizations();
    //   });
    // }

    // this.getNotificationData();

    this.preventWebBackButton();
    this.destroyDelay(this.exitDelay);
  }

  ngOnInit() {
    this.storeService.localGet(this.localParam.localParam.insuredUser).then(resp => this.user = resp);
    this.storeService.localGet(this.localParam.localParam.createdTicket).then(resp => this.ticket = resp);

    setTimeout(() => {
      // console.log(`user: ${JSON.stringify(this.user)}\n ticket: ${JSON.stringify(this.ticket)}`)
      // console.log(this.user)
      // console.log(this.ticket)
      this.refreshTicket();
      this.timeToRefresh();
      this.getTicketInfo();
      this.getTicketUbi();
      this.getTicketDesti();
      this.getTicketPosition();
     
    }, 1000)
    setTimeout(() => {
      this.timer();
    }, 5000)
  }

  ionViewWillLeave() {
    clearInterval(this.intervalRefresher);
    this.destroyDelay(this.exitDelay);
    // console.log("delete interval")
  }

  timeToRefresh() {
    this.intervalRefresher = setInterval(() => {
      this.refreshTicket();
    }, 10000)
  }

  preventWebBackButton() {
    if (this.platform.is('android') && this.platform.is('mobileweb')) {
      history.pushState(null, null, window.top.location.pathname + window.top.location.search);
      window.addEventListener('popstate', (e) => {
        e.preventDefault();
        history.pushState(null, null, window.top.location.pathname + window.top.location.search);
      });
    } else if (this.platform.is('ios') && this.platform.is('mobileweb')) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    }
  }

  delay() {
    this.exitDelay = setTimeout(() => {
      this.storage.remove("created-ticket");
      this.storage.remove("ticket-status");
      this.router.navigateByUrl('/servicios');
    }, 60000);
  }

  destroyDelay(exitDelay) {
    if (this.platform.is('mobileweb')) {
      window.onbeforeunload = function () {
        clearTimeout(exitDelay);
      };
    }
    clearTimeout(this.exitDelay);
  }
  getTicketInfo() {
    
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.createdTicket = resp;
      if(!this.createdTicket){
        this.ticketNumber = "No hay tiquete";
        this.cancelDisable = true;
      }else if(this.createdTicket){
        this.ticketNumber = this.createdTicket.ticketNumber;
        
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
        this.ticketUbi = this.ticketStatus[0].queueName;
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
        this.ticketDesti = this.ticketStatus[0].currentServiceName;
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
        this.ticketPosition = this.ticketStatus[0].position+" personas adelante";
      }
    }, (err) => {
      console.error(err);
    });
  }
 //Revisa si existe un tiquete creado, si existe hace un get del tiquete nuevamente para refrescarlo
 refreshTicket(){
  this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
    this.createdTicket = resp;
    if (this.createdTicket) {
      let visitId = this.createdTicket.visitId;
      this.services.getTicket(this.params.params.ticketStatus + '/' + visitId).subscribe((resp) => {
        this.refreshedTicket = resp;
        this.storeService.localSave(this.localParam.localParam.ticketStatus, this.refreshedTicket);
        let positionInQueue = this.refreshedTicket[0].positionInQueue;
        let currentStatus = this.refreshedTicket[0].currentStatus;
        if (this.lastPosition != positionInQueue && positionInQueue != null) {
          this.stopPositionPopUp = false;
          this.lastPosition = positionInQueue;
          this.positionUpdated(positionInQueue);
        }
      
        this.ticketDesti = this.refreshedTicket[0].currentServiceName;
        this.ticketPosition = "Su posición es: " + positionInQueue;
        this.maxProgressBar = 1 / positionInQueue;
        let calledFrom = this.refreshedTicket[0].servicePointName;
        if (currentStatus == "CALLED") {
          this.ticketPosition = "Su posición es: " + 0;
          if (!this.stopPopUp) {
            //this.stopPopUp = true;
            if (this.popUp == null) {
              this.presentAlert(calledFrom);
              //this.setVibration();
             
            } else if (this.popUp != null) {
              this.popUp.dismiss();
              this.presentAlert(calledFrom);
              //this.setVibration();
          
            }
          }
        }
        this.ticketNumber = this.refreshedTicket[0].ticketId;
        //this.ticketDesti = this.refreshedTicket.queueName;
        //console.log(this.refreshedTicket);

      }, (err) => {
        if (err.status == 404) {
          this.storage.remove("created-ticket");
          this.storage.remove("ticket-status");
          this.ticketNumber = "Atendido";
          this.ticketPosition = "Atendido";
          this.ticketUbi = "Atendido";
          this.ticketDesti = "Atendido";
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


  positionUpdated(positionInQueue) {

    if (positionInQueue == null) {
      positionInQueue = 0;
    }
    if (positionInQueue <= 5) {
      if (!this.stopPositionPopUp) {
        // this.stopPopUp = true;
        if (this.positionPopUp == null) {
          this.alertPosition();
          this.alertPositionInQueue(positionInQueue);
          this.stopPositionPopUp = true;
        } else if (this.positionPopUp != null) {
          this.positionPopUp.dismiss();
          this.alertPosition();
          this.alertPositionInQueue(positionInQueue);
          this.stopPositionPopUp = true;
        }
      }
    }
  }

  async alertPositionInQueue(positionInQueue) {
    //this.alertPosition();
    console.log("alertPositionInQueue");
    this.positionPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'CCSS:',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/tickets3.png"></img><br> <br> Faltan ' + positionInQueue + ' tickets para su llamado.',
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          //console.log('you clicked me');
          this.stopPositionPopUp = true;
        }
      },
      ]
    });
    await this.positionPopUp.present();

    this.stopPositionPopUp = true;
  }

  alertPosition() {
    console.log("alertPosition")
    this.localNotificactions.schedule({
      id: 2,
      title: 'Aviso',
      text: 'Su posición en la fila se ha modificado',
      priority: 2,
      foreground: true,
      lockscreen: true,
      vibrate: true,
      //sound: this.setSoundOnEntry(),
      data: { secret: 'key' }
    });
    // this.setVibration();
    // this.alertSound = true;
  }

  async presentAlert(calledFrom) {
    console.log("Present alert "+calledFrom);
    this.alertTi();
    this.popUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'CCSS',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/unticket.png"></img><br> <br> Su ticket número ' + this.ticketNumber + ' está siendo llamado, pasar a la ventanilla: ' + calledFrom,
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          this.stopPopUp = true;
          this.cancelDisable = true;
          this.postPoneDisable = true;
          this.delay();
          this.router.navigateByUrl('/menu/first/tabs/tab2');
          // OneSignal.removeExternalUserId();
          // OneSignal.setSubscription(false);
        }
      },
      ],
      backdropDismiss: false
    });
    await this.popUp.present();
  }

  alertTi() {
    console.log("alertTi");
    this.localNotificactions.schedule({
      id: 1,
      title: 'Aviso',
      text: 'Usted esta siendo llamado',
      priority: 2,
      foreground: true,
      lockscreen: true,
      vibrate: true,
      //sound: this.setSoundOnEntry(),
      data: { secret: 'key' }
    });
    // this.setVibration();
  }

  async exitTicket() {
    let exitPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'CCSS Tickets',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/like.png"></img><br> <br><h6>Ticket Finalizado</h6>Te invitamos a seguir utilizando nuestro servicios.',

      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          this.storage.remove("created-ticket");
          this.storage.remove("ticket-status");
          this.router.navigateByUrl('/servicios');
        }
      },
      ]
    });
    await exitPopUp.present();
  }
  // goToIndoors() {
  //   this.router.navigateByUrl('/menu/first/tabs/tab1/0');
  // }
  async popUpExit() {
    let exitPopUp = await this.alertCtrl.create({
      header: '¿Desea salir?',
      subHeader: '',
      message:
        'Si tiene un ticket activo se perderá',
      buttons: [{
        text: 'Sí',
        role: 'OK',
        handler: () => {
          this.cancelTicket();
          this.storage.remove("created-ticket");
          this.storage.remove("ticket-status");
        }
      },
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          //console.log('Cancelar');
        }
      },
      ]
    });
    await exitPopUp.present();
  }

  cancelTicket() {
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      let createdTicket = resp;
      let visitId = createdTicket.visitId;
      let queueId = createdTicket.queueId;
      let officeId = createdTicket.branchId;
      let serviceId = createdTicket.serviceId;

      this.services.delete(
        this.params.params.deleteTicket + '/services/' + serviceId + '/branches/' + officeId + '/ticket/' + visitId + '/queueId/' + queueId).subscribe((resp) => {

          this.cancelledTicket();
         
        }, (err) => {
          console.error(err);
        });
    }, (err) => {
      console.error(err);
    });
  }
  async cancelledTicket() {
    let cancelledPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'CCSS Tickets',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/cancel.png"></img><br> <br><h6>Has cancelado el ticket generado</h6>Le invitamos a seguir utilizando nuestro servicio CCSS Tickets.',

      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          this.storage.remove("created-ticket");
          this.storage.remove("ticket-status");
          this.router.navigateByUrl('/servicios');
        }
      },
      ]
    });
    await cancelledPopUp.present();
  }
  go() {
    this.storeService.localGet(this.localParam.localParam.places).then((resp) => {
    let places=resp;
    this.presentLoadingDefaults();
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + places.placeId);
    }, (err) => {
      console.error(err);
    });
   
  }
  async presentLoadingDefaults() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
}
