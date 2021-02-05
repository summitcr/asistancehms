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
  refreshedTicket: Object;
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
    }, 200)
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
      this.storage.forEach((value, key)=>{
        if(key !== this.localParam.localParam.insuredUser){
          this.storage.remove(key);
        }
      })
      this.router.navigateByUrl('/servicios');
    }, 300000);
  }

  destroyDelay(exitDelay) {
    if (this.platform.is('mobileweb')) {
      window.onbeforeunload = function () {
        clearTimeout(exitDelay);
      };
    }
  }

  refreshTicket() {
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.ticket = resp;
      if (this.ticket) {
        let visitId = this.ticket["visitId"];
        this.services.get(this.params.params.ticketStatus + '/' + visitId).subscribe((resp) => {
          this.refreshedTicket = resp;
          this.storeService.localSave(this.localParam.localParam.ticketStatus, this.refreshedTicket);
          let positionInQueue = this.refreshedTicket["position"];
          let currentStatus = this.refreshedTicket["currentStatus"];
          if (this.oldTicketPosition != positionInQueue && positionInQueue != "") {
            console.log("entra cuando la posicion actual es diferente a la que entra en la llamada")
            console.log(this.ticket)
            console.log(`Posicion Actual ${this.ticketPosition} <== VS ==> ${positionInQueue} Posicion Entrante `)
            this.stopPositionPopUp = false;
            // this.alertSound = false;
            this.ticketPosition = "Su posición en la fila es: "+positionInQueue;
            this.oldTicketPosition = positionInQueue;
            console.log(this.ticket)
            this.positionUpdated(positionInQueue);
          }
          this.ticket.serviceName = this.refreshedTicket["currentServiceName"];
          this.ticketServiceName = this.refreshedTicket["currentServiceName"];
          this.ticketPosition = positionInQueue;
          this.ticket
          this.maxProgressBar = 1 / positionInQueue;
          let calledFrom = this.refreshedTicket["servicePointName"];
          if (currentStatus == "CALLED") {
            console.log("currentStatus: "+currentStatus)
            this.ticketPosition = "Su turno en fila es: " + 0;
            if (!this.stopPopUp) {
              // this.stopPopUp = true;
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
          this.ticketNumber = this.refreshedTicket["ticketId"];
          //this.ticketDesti = this.refreshedTicket.queueName;
          //console.log(this.refreshedTicket);

        }, (err) => {
          if (err.status == 404) {
            this.storage.remove("created-ticket");
            this.storage.remove("ticket-status");
            this.ticketNumber = "Atendido";
            this.ticketPosition = "Atendido";
            this.ticket.serviceName = "Atendido";
          }
        });
      }
    }, (err) => {
      console.error(err);
    });
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
      header: 'Ficoticket',
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

  // async popUpExit() {
  //   let exitPopUp = await this.alertCtrl.create({
  //     header: '¿Desea salir?',
  //     subHeader: '',
  //     message:
  //       'Si tiene un ticket activo se perderá',
  //     buttons: [{
  //       text: 'Sí',
  //       role: 'OK',
  //       handler: () => {
  //         this.cancelTicket();
  //         this.storage.clear();
  //       }
  //     },
  //     {
  //       text: 'No',
  //       role: 'cancel',
  //       handler: () => {
  //         //console.log('Cancelar');
  //       }
  //     },
  //     ]
  //   });
  //   await exitPopUp.present();
  // }

  // cancelTicket() {
  //   this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
  //     let createdTicket = resp;
  //     let visitId = createdTicket.visitId;
  //     let queueId = createdTicket.queueId;
  //     let officeId = createdTicket.branchId;
  //     let serviceId = createdTicket.serviceId;

  //     this.services.delete(
  //       this.params.params.deleteTicket + '/services/' + serviceId + '/branches/' + officeId + '/ticket/' + visitId + '/queueId/' + queueId).subscribe((resp) => {

  //         this.cancelledTicket();
  //         OneSignal.removeExternalUserId();
  //         OneSignal.setSubscription(false);

  //       }, (err) => {
  //         console.error(err);
  //       });
  //   }, (err) => {
  //     console.error(err);
  //   });
  // }

}