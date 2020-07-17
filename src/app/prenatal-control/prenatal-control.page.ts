import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, IonSlides, IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';


export interface Survey {
  name: String,
  identifier: String,
  prg_estadoCivil: String,
  prg_edad: String,
  prg_escolaridad: String,
  prg_ultimaRegla: Date,
  prg_segura: String,
  prg_peso: String,
  prg_estatura: String,
  prg_controlPrenatal: String,
  prg_tipoSangre: String,
  prg_rh: String,
  prg_cantidadBebes: String,
  prg_cantidadHijos: String,
  prg_tratamientoEmbarazo: String,
  prg_cirugias: String,
  prg_infeccionesVag: String,
  prg_infeccionesUr: String,
  prg_ultimoEmbarazo: Date
}
export interface RecibirInfo {
  topicID: number,
  identifier: String
}
export interface EnfermedadesCronicas {
  diseaseId: number,
  identifier: String
}

export interface EnfermerdadesActual {
  diseaseId: number,
  identifier: String
}

export interface Complicaciones {
  complicationId: number,
  identifier: String
}


@Component({
  selector: 'app-prenatal-control',
  templateUrl: './prenatal-control.page.html',
  styleUrls: ['./prenatal-control.page.scss'],
})
export class PrenatalControlPage implements OnInit {
  @ViewChild(IonContent, {static: true}) content: IonContent;

  @ViewChild('slides', { static: true }) slider: IonSlides; 
  segment = 0;  
  
  async segmentChanged(ev: any) {  
    await this.slider.slideTo(this.segment);  
  
  }  
  async slideChanged() {  
    this.segment = await this.slider.getActiveIndex();  
    this.focusSegment(this.segment+1);
  }
  focusSegment(segmentId) {
    document.getElementById('seg-'+segmentId).scrollIntoView({ 
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }
 
  surveyModel: Survey = {
    name: '',
    identifier: null,
    prg_estadoCivil: '',
    prg_edad: '',
    prg_escolaridad: '',
    prg_ultimaRegla: null,
    prg_segura: '',
    prg_peso: '',
    prg_estatura: '',
    prg_controlPrenatal: '',
    prg_tipoSangre: '',
    prg_rh: '',
    prg_cantidadBebes: '',
    prg_cantidadHijos: '',
    prg_tratamientoEmbarazo: '',
    prg_cirugias: '',
    prg_infeccionesVag: '',
    prg_infeccionesUr: '',
    prg_ultimoEmbarazo: null
  }
  recibirModel: RecibirInfo = {
    topicID: null,
    identifier: "",
  }
enferCronicaModel: EnfermedadesCronicas={
  diseaseId:null,
  identifier:"",
}
enferActualModel: EnfermerdadesActual={
  diseaseId:null,
  identifier:"",
}
complicatModel: Complicaciones={
  complicationId:null,
  identifier:"",
}

  myForm: FormGroup;
  userIdentifier: any;
  topics: any;
  chronic: any;
  current: any;
  complicat: any;
  userEstado: any;
  userEdad: any;
  userEscolaridad: any;
  userDate1: any;
  userSegura: any;
  userPeso: any;
  userEstatura: any;
  userCP: any;
  userTipoSangre: any;
  userCantidadEmba: any;
  getMaternidad: any;
  userRH: any;
  userCantidadBebe: any;
  userTratamiento: any;
  userCirugia: any;
  userInfeccionesV: any;
  userInfeccionesU: any;
  userUltimoEmba: any;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private router: Router,
    private alertCtrl: AlertController) {
    this.myForm = this.createMyForm();
    
  }
 
  features = {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    paginationBulletRender: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
    }
    };
    slideOptsOne = {
      initialSlide: 0,
      slidesPerView: 1,
      lockSwipes:false,
      autoHeight: true,
      pagination: {
            el: '.swiper-pagination',
           clickable: true,
          renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                    },
          }
     };
  
  ngOnInit() {
    this.getTopics();
    this.getChronic();
    this.getCurrent();
    this.getComplicat();
    this.getUserIdentifier();
  

  }
  private createMyForm() {
    return this.formBuilder.group({
      escolaridad: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      seguridad: ['', Validators.required],
      peso: ['', Validators.required],
      estatura: ['', Validators.required],
      edad: ['', Validators.required],
      controlPrena: ['', Validators.required],
      tipoSangre: ['', Validators.required],
      tipoRH: ['', Validators.required],
      cantidadBebe: ['', Validators.required],
      cantidadEmba: ['', Validators.required],
      controlTratamiento: ['', Validators.required],
      controlCirugia: ['', Validators.required],
      controlInfeccionV: ['', Validators.required],
      controlUrinaria: ['', Validators.required],
      fechaUltima: ['', Validators.required],
      fechaTerminacion: ['', Validators.required],
    });
  }
  
  getUserIdentifier() {
    this.storeService.localGet(this.localParam.localParam.insuredUser).then((resp) => {
      this.userIdentifier = resp;
      
    }, (err) => {
      console.error(err);
    });
  }
  getTopics() {
    this.services.get(this.params.params.topicsInformations).subscribe((resp) => {
      this.topics = resp;
      console.log(this.topics);
    }, (err) => {
      console.error(err);
    });
  }
  getChronic() {
    this.services.get(this.params.params.chronicDiseases).subscribe((resp) => {
      this.chronic = resp;
      console.log(this.chronic);
    }, (err) => {
      console.error(err);
    });
  }
  getCurrent() {
    this.services.get(this.params.params.currentDiseases).subscribe((resp) => {
      this.current = resp;
      console.log(this.current);
    }, (err) => {
      console.error(err);
    });
  }
  getComplicat() {
    this.services.get(this.params.params.complications).subscribe((resp) => {
      this.complicat = resp;
      console.log(this.complicat);
    }, (err) => {
      console.error(err);
    });
  }
  getTopicsCheckedBoxes() {
    let checkboxes = document.querySelectorAll(".check-topics.checkbox-checked");
    let checkboxesId = [];
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }
  getEnfermedadesCheckedBoxes() {
    let checkboxes = document.querySelectorAll(".check-enfermedades.checkbox-checked");
    let checkboxesId = [];
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }
  getCurrentCheckedBoxes() {
    let checkboxes = document.querySelectorAll(".check-current.checkbox-checked");
    let checkboxesId = [];
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }
  getComplicatCheckedBoxes() {
    let checkboxes = document.querySelectorAll(".check-complicat.checkbox-checked");
    let checkboxesId = [];
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }
  
  saveSurvey() {

    this.surveyModel.identifier = this.userIdentifier.identifier;
    this.surveyModel.name = this.userIdentifier.name;
    this.surveyModel.prg_estadoCivil = this.userEstado;
    this.surveyModel.prg_edad = this.userEdad;
    this.surveyModel.prg_escolaridad = this.userEscolaridad;
    this.surveyModel.prg_ultimaRegla = this.userDate1;
    this.surveyModel.prg_segura = this.userSegura;
    this.surveyModel.prg_peso = this.userPeso;
    this.surveyModel.prg_estatura = this.userEstatura;
    this.surveyModel.prg_controlPrenatal = this.userCP;
    this.surveyModel.prg_tipoSangre = this.userTipoSangre;
    this.surveyModel.prg_cantidadBebes = this.userCantidadEmba;
    this.surveyModel.prg_rh = this.userRH;
    this.surveyModel.prg_cantidadHijos = this.userCantidadBebe;
    this.surveyModel.prg_tratamientoEmbarazo = this.userTratamiento;
    this.surveyModel.prg_cirugias = this.userCirugia;
    this.surveyModel.prg_infeccionesVag = this.userInfeccionesV;
    this.surveyModel.prg_infeccionesUr = this.userInfeccionesU;
    this.surveyModel.prg_ultimoEmbarazo = this.userUltimoEmba;
    this.services.save(this.params.params.prenatalCare_poll, this.surveyModel).subscribe((resp) => {
      this.getMaternidad = resp;
      // this.presentConfirm();
      console.log(this.getMaternidad);


    }, (err) => {
      console.error(err);
    });
  }
  saveTopic() {
    console.log(this.userIdentifier.identifier);
    let topicsCheckBoxesId = this.getTopicsCheckedBoxes();
    this.recibirModel.identifier =  this.userIdentifier.identifier;
    for (let i = 0; i < topicsCheckBoxesId.length; i++) {
      this.recibirModel.topicID = topicsCheckBoxesId[i];
      this.services.save(this.params.params.topicsInformation_pacient, this.recibirModel).subscribe(() => {

      }, (err) => {

      });
    }

  }
  saveEnfermedades() {
   
    let enferCheckBoxesId = this.getEnfermedadesCheckedBoxes();
    this.enferCronicaModel.identifier = this.userIdentifier.identifier;
    for (let i = 0; i < enferCheckBoxesId.length; i++) {
      this.enferCronicaModel. diseaseId = enferCheckBoxesId[i];
      this.services.save(this.params.params.chronicDiseases_pacient, this.enferCronicaModel).subscribe(() => {

      }, (err) => {

      });
    }

  }
  saveCurrent() {
    let currentCheckBoxesId = this.getCurrentCheckedBoxes();
    this.enferActualModel.identifier = this.userIdentifier.identifier;
    for (let i = 0; i < currentCheckBoxesId.length; i++) {
      this.enferActualModel. diseaseId = currentCheckBoxesId[i];
      this.services.save(this.params.params.currentDiseases_pacient, this.enferActualModel).subscribe(() => {

      }, (err) => {

      });
    }

  }
  saveComplicat(){
   
    let complicatCheckBoxesId = this.getComplicatCheckedBoxes();
    this.complicatModel.identifier = this.userIdentifier.identifier;
    for (let i = 0; i < complicatCheckBoxesId.length; i++) {
      this.complicatModel.complicationId = complicatCheckBoxesId[i];
      this.services.save(this.params.params.complications_pacient, this.complicatModel).subscribe(() => {

      }, (err) => {

      });
    }
  }
  confirm(){
    this.saveSurvey();
    this.saveTopic();
    this.saveEnfermedades();
    this.saveCurrent();
    this.saveComplicat();
    this. presentAlert();
    this.router.navigateByUrl('/menu/first/tabs/tab2');
  }
  //ACA
  
  
  ScrollToPoint() {
    setTimeout(() => {
    this.content.scrollToTop(500);
  }, 500);
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      subHeader: '',
      message:
        'Gracias por llenar la encuesta',
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          //console.log('you clicked me');
        }
      },
      ]
    });
    await alert.present();
  }
}//fin de la class
