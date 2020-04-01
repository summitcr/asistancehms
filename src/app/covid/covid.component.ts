import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { LoadingController } from '@ionic/angular';

export interface DiagnosticSymptom {
  diagnosticId: number,
  symptomId: number,
  patientId: String
}

export interface DiagnosticCases {
  diagnosticId: number,
  anotherCaseId: number,
  patientId: String
}

export interface NoRegisteredDiagSymtom {
  noRegisterDiagId: number,
  symptomId: number,
  noInsuredPatientId: String
}

export interface NoRegisteredDiagCases {
  noRegisterDiagId: number,
  anotherCaseId: number,
  noInsuredPatientId: String
}

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss'],
})

export class CovidComponent implements OnInit, AfterViewInit {

  diagSymptomModel: DiagnosticSymptom = {
    diagnosticId: null,
    symptomId: null,
    patientId: ''
  }

  caseSymptomModel: DiagnosticCases = {
    diagnosticId: null,
    anotherCaseId: null,
    patientId: ''
  }

  NoRegisterDiagSymptomModel: NoRegisteredDiagSymtom = {
    noRegisterDiagId: null,
    symptomId: null,
    noInsuredPatientId: ''
  }

  NoRegisterDiagCaseModel: NoRegisteredDiagCases = {
    noRegisterDiagId: null,
    anotherCaseId: null,
    noInsuredPatientId: ''
  }

  router: any;
  symptoms: any;
  anotherCases: any;
  userLogged: any;
  symptomId = [];
  diagnostic: any;
  getSymptoms: any;
  getAnotherCases: any;
  insured: any;
  notInsuredUser: any;

  constructor(
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    public loadingCtrl: LoadingController,) {

    }

  ngOnInit() {
    this.getUserLogged();
    this.getDbSymptoms();
    this.getDbCases();
    this.presentLoadingDefault();
    setTimeout(() => {
      this.insuredOrNotInsured();
    }, 4000);
  }

  ngAfterViewInit() {

  }

  async presentLoadingDefault() {
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }

  public event = {
    month: '2020-01-01'
    
  }

  //Metodo que trae los sintomas desde la base de datos
  getDbSymptoms(){
    this.services.get('http://localhost:61362/api/symptoms').subscribe((resp) => {
      this.symptoms = resp;

      console.log(this.symptoms);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que trae los casos/observaciones desde la base de datos
  getDbCases(){
    this.services.get('http://localhost:61362/api/anotherCases').subscribe((resp) => {
      this.anotherCases = resp;

      console.log(this.anotherCases);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que trae desde el local storage los datos que la persona llenó en el formulario
  getNotInsuredUser(){
    this.storeService.localGet(this.localParam.localParam.insuredUser).then((resp) => {
      this.notInsuredUser = resp;
      console.log(this.notInsuredUser);
    }, (err) => {
      console.error(err);
    });
  }

  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.userLogged = resp;

    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que trae el diagnostico de la persona asegurada/loggeada
  getDiagnostic(){
    this.storeService.localGet(this.localParam.localParam.diagnostic).then((resp) => {
      this.diagnostic = resp;

    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que verifica si la persona es asegurada o no, si se encuentra loggeada o no
  insuredOrNotInsured(){
    this.storeService.localGet(this.localParam.localParam.insured).then((resp) => {
      this.insured = resp;
      if(this.insured == true){
        this.getDiagnostic();
      }else if (this.insured == false){
        this.getNotInsuredUser();
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que obtiene los check box de sintomas marcados
  getSymptomsCheckedBoxes(){
    let checkboxes = document.querySelectorAll(".check-symptoms.checkbox-checked");
    let checkboxesId = [];
    for(let i = 0; i < checkboxes.length; i++){
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }

  //Metodo que obtiene los check box de casos/observaciones marcados
  getCasesCheckedBoxes(){
    let checkboxes = document.querySelectorAll(".check-cases.checkbox-checked");
    let checkboxesId = [];
    for(let i = 0; i < checkboxes.length; i++){
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }

  //Metodo que guarda la informacion marcada por el usuario, si la persona NO es asegura/ NO esta loggeada
  //se guarda en una tabla diferente
  confirmar(){
    //this.getDiagnostic();
    if(this.insured == true){
      let userId = this.userLogged.person.identifier;
      let symptomsCheckBoxesId = this.getSymptomsCheckedBoxes();
      let casesCheckBoxesId = this.getCasesCheckedBoxes();
  
      this.diagSymptomModel.diagnosticId = this.diagnostic.id;
      this.diagSymptomModel.patientId = userId;
  
      for(let i = 0; i < symptomsCheckBoxesId.length; i++){
        this.diagSymptomModel.symptomId = symptomsCheckBoxesId[i];
        this.services.save('http://localhost:61362/api/diagnosticSymptoms', this.diagSymptomModel).subscribe(() => {
    
        }, (err) => {
  
        });
      }
  
      this.caseSymptomModel.diagnosticId = this.diagnostic.id;
      this.caseSymptomModel.patientId = userId;
  
      for(let i = 0; i < casesCheckBoxesId.length; i++){
        this.caseSymptomModel.anotherCaseId = casesCheckBoxesId[i];
        this.services.save('http://localhost:61362/api/diagnosticCases', this.caseSymptomModel).subscribe(() => {
    
        }, (err) => {
  
        });
      }
    }else{
      let symptomsCheckBoxesId = this.getSymptomsCheckedBoxes();
      let casesCheckBoxesId = this.getCasesCheckedBoxes();
  
      this.NoRegisterDiagSymptomModel.noRegisterDiagId = this.notInsuredUser.id;
      this.NoRegisterDiagSymptomModel.noInsuredPatientId = this.notInsuredUser.identifier;
  
      for(let i = 0; i < symptomsCheckBoxesId.length; i++){
        this.NoRegisterDiagSymptomModel.symptomId = symptomsCheckBoxesId[i];
        this.services.save('http://localhost:61362/api/noRegisteredDiagSymtoms', this.NoRegisterDiagSymptomModel).subscribe(() => {
    
        }, (err) => {
  
        });
      }
  
      this.NoRegisterDiagCaseModel.noRegisterDiagId = this.notInsuredUser.id;
      this.NoRegisterDiagCaseModel.noInsuredPatientId = this.notInsuredUser.identifier;
  
      for(let i = 0; i < casesCheckBoxesId.length; i++){
        this.NoRegisterDiagCaseModel.anotherCaseId = casesCheckBoxesId[i];
        this.services.save('http://localhost:61362/api/noRegisteredDiagCases', this.NoRegisterDiagCaseModel).subscribe(() => {
    
        }, (err) => {
  
        });
      }
    }
    
  }

}
