import { Component, OnInit } from '@angular/core';
import { UtilStorageService } from '../services/util-storage.service';
import { StorageService } from '../services/storage.service';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

export interface Diagnostic {
  pacientId: number,
  preguntaFiebre: String,
  preguntaDisnea: String,
  preguntaTos: String,
  preguntaNasal: String,
  preguntaOlfato: String,
  preguntaGusto: String,
  preguntaEtiologia: String,
  preguntaSintoma: String,
  preguntaViaje: String,
  preguntaMal: String,
}

@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.page.html',
  styleUrls: ['./coronavirus.page.scss'],
})
export class CoronavirusPage implements OnInit {

  diagnosticModel: Diagnostic = {
    pacientId: null,
    preguntaFiebre: '',
    preguntaDisnea: '',
    preguntaTos: '',
    preguntaNasal: '',
    preguntaOlfato: '',
    preguntaGusto: '',
    preguntaEtiologia: '',
    preguntaSintoma: '',
    preguntaViaje: '',
    preguntaMal: '',

  }
  getpacient: any;
  getpoll: any;
  userIdentifier: any;
  userLogged: any;
  diagnostic: any;
  diagnosticExists: any;
  myForm: FormGroup;
  userFiebre: any;
  userDisnea: any;
  userTos: any;
  userNasal: any;
  userOlfato: any;
  userGusto: any;
  userEti: any;
  userSintoma: any;
  userViajado: any;
  userViaje: any;
  serviceId: any;
  ticketStatus: Object;
  createdTicket: any;
  idQueue: any;
  idPoint: Object;
  constructor(
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private router: Router,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public platform: Platform,
    private ble: BLE) {
    this.myForm = this.createMyForm();
    this.enableBluetooth()
  }

  ngOnInit() {
    const navigationState = this.router.getCurrentNavigation().extras.state;
    if (
      navigationState !== undefined && navigationState !== null &&
      navigationState.data.id !== undefined && navigationState.data.id !== null
    ) {
      this.serviceId = navigationState.data.id;
      console.log(this.serviceId);
      // setTimeout(() => {
      //   // console.log(navigationState.data.id)
      //   const office = this.filterOfficePerID(navigationState.data.id);

      //   // console.log(this.offices[office]);
      //   this.officesList.value = this.offices[office];
      // }, 2500);
    }
    this.getUserLogged();
    this.getUserIdentifier();
    //this.listaPoll();
  }
  enableBluetooth(){
    if(this.platform.is('android')){
      this.ble.enable(
        );
    }
  }
  getUserLogged() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.userLogged = resp;

    }, (err) => {
      console.error(err);
    });
  }
  getUserIdentifier() {
    this.storeService.localGet(this.localParam.localParam.insuredUser).then((resp) => {
      this.userIdentifier = resp;
      console.log(this.userIdentifier);
    }, (err) => {
      console.error(err);
    });
  }
  confirmSurvey() {
    this.diagnosticModel.pacientId = this.userIdentifier.identifier;
    this.diagnosticModel.preguntaFiebre = this.userFiebre;
    this.diagnosticModel.preguntaDisnea = this.userDisnea;
    this.diagnosticModel.preguntaTos = this.userTos;
    this.diagnosticModel.preguntaNasal = this.userNasal;
    this.diagnosticModel.preguntaOlfato = this.userOlfato;
    this.diagnosticModel.preguntaGusto = this.userGusto;
    this.diagnosticModel.preguntaEtiologia = this.userEti;
    this.diagnosticModel.preguntaSintoma = this.userSintoma;
    this.diagnosticModel.preguntaViaje = this.userViaje;
    this.diagnosticModel.preguntaMal = this.userViajado;
    this.services.save(this.params.params.pacient_poll, this.diagnosticModel).subscribe((resp) => {
      this.getpacient = resp;
      // this.presentConfirm();
      console.log(resp);
      if (resp != null) {
        this.listaPoll();
      }
    }, (err) => {
      console.error(err);
    });
  }
  listaPoll() {
    let count = 0;
    let userId = this.userIdentifier.identifier;
    this.services.get(this.params.params.pacient_poll + '/' + userId).subscribe((resp) => {
      this.getpoll = resp;
      console.log(this.getpoll);
      if (this.getpoll.preguntaOlfalto == 'Si') {
        count++;
      }
      if (this.getpoll.preguntaFiebre == 'Si') {
        count++;
      }
      if (this.getpoll.preguntaGusto == 'Si') {
        count++;
      }
      if (this.getpoll.preguntaSintoma == 'Si') {
        count++;

      }
      console.log(count)
      if (count > 2) {
        this.presentAlert();

      } else {
        this.presentConfirm();

      }
    }, (err) => {
      console.error(err);
    });
  }
  healthyStatus() {
    let userId = this.userLogged.person.identifier;
    this.diagnosticModel.pacientId = 1;
    //this.diagnosticModel.patientId = userId;

    this.services.get(this.params.params.diagnostics + '/' + userId).subscribe((resp) => {
      this.diagnosticExists = resp;

      if (this.diagnosticExists) {
        console.log("Ya haz hecho el diagnostico");
        this.router.navigateByUrl('/menu/first/tabs/tab1/0');
      }

    }, (err) => {
      if (err.status == 404) {
        this.services.save(this.params.params.diagnostics, this.diagnosticModel).subscribe(() => {
          console.log("Se agregó el diagnostico");
        }, (err) => {
          console.error(err);
        });
      }
    });

  }

  unhealthyStatus() {
    let userId = this.userLogged.person.identifier;
    this.diagnosticModel.pacientId = 2;
    //this.diagnosticModel.patientId = userId;

    this.services.get(this.params.params.diagnostics + '/' + userId).subscribe((resp) => {
      this.diagnosticExists = resp;

      if (this.diagnosticExists) {
        console.log("Ya haz hecho el diagnostico");
        this.router.navigateByUrl('/menu/first/tabs/tab1/0');
      }

    }, (err) => {
      if (err.status == 404) {
        this.services.save(this.params.params.diagnostics, this.diagnosticModel).subscribe((resp) => {
          this.diagnostic = resp;
          this.storeService.localSave(this.localParam.localParam.diagnostic, this.diagnostic);
          console.log("Se agregó el diagnostico");
        }, (err) => {
          console.error(err);
        });
      }
    });
  }
  private createMyForm() {
    return this.formBuilder.group({
      preguntaFiebre: ['', Validators.required],
      preguntaDisnea: ['', Validators.required],
      preguntaTos: ['', Validators.required],
      preguntaNasal: ['', Validators.required],
      preguntaOlfato: ['', Validators.required],
      preguntaGusto: ['', Validators.required],
      preguntaEtiologia: ['', Validators.required],
      preguntaSintomas: ['', Validators.required],
      preguntaViajado: ['', Validators.required],
      preguntaMal: ['', Validators.required],

    });
  }
  getTicketStatus(visitId) {
    this.services.get(this.params.params.ticketStatus + '/' + visitId).subscribe((resp) => {
      this.ticketStatus = resp;
      this.idQueue=this.ticketStatus[0].queueId;
      this.getPointService(this.idQueue);
      this.storeService.localSave(this.localParam.localParam.ticketStatus, this.ticketStatus);

      console.log(this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }
  getPointService(id) {
    this.services.get(this.params.params.getByServiceId + '/' + id).subscribe((resp) => {
      this.idPoint= resp;
      this.storeService.localSave(this.localParam.localParam.idPointTicket, this.idPoint);
      console.log(this.idPoint);
    }, (err) => {
      console.error(err);
    });
  }
  createTicket() {
    let userId = this.userIdentifier.identifier;
    this.services.saveT(this.params.params.ticketCreate + '/serviceId/' +this.serviceId+'/officeId/'+'2'+'/userId/'+userId).subscribe((resp) => {
      console.log(resp)
      this.createdTicket=resp;
      this.storeService.localSave(this.localParam.localParam.createdTicket, resp);
      this.router.navigateByUrl('/menu/first/tabs/tab2');
      // this.router.navigateByUrl(`/menu/first/tabs/tab1/${this.serviceId}`);
      
       this.getTicketStatus(this.createdTicket.visitId);
    }, (err) => {
      console.error(err);
    });
  }

  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      subHeader: '',
      message:
        'Gracias por realizar la encuesta.',
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.createTicket();
          // this.router.navigateByUrl('/menu/first/tabs/tab1/' + '5e4ef9b6bdadf00016d02b1f');
          // this.router.navigateByUrl('/map-routing');
          //console.log('you clicked me');
        }
      },
      ]
    });
    await alert.present();
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      subHeader: '',
      message:
        'Por favor, dirijase al área de aislamiento',
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          //  this.go();
          //console.log('you clicked me');
          this.router.navigateByUrl('/servicios');
        }
      },
      ]
    });
    await alert.present();
  }
  go() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + '5e4ef9b6bdadf00016d02b1f');
  }
}//fin de la class
