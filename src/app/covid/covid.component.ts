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

  router: any;
  symptoms: any;
  anotherCases: any;
  userLogged: any;
  symptomId = [];
  diagnostic: any;

  constructor(
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    public loadingCtrl: LoadingController,) {

    }

  ngOnInit() {
    this.getUserLogged();
    this.getLocalSymptoms();
    this.getLocalCases();
    this.presentLoadingDefault();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getDiagnostic();
    }, 4000);

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

  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.userLogged = resp;

    }, (err) => {
      console.error(err);
    });
  }

  getDiagnostic(){
    this.storeService.localGet(this.localParam.localParam.diagnostic).then((resp) => {
      this.diagnostic = resp;

    }, (err) => {
      console.error(err);
    });
  }

  getLocalSymptoms(){
    this.storeService.localGet(this.localParam.localParam.symptoms).then((resp) => {
      this.symptoms = resp;

      console.log(this.symptoms);
    }, (err) => {
      console.error(err);
    });
  }

  getLocalCases(){
    this.storeService.localGet(this.localParam.localParam.anotherCases).then((resp) => {
      this.anotherCases = resp;

      console.log(this.anotherCases);
    }, (err) => {
      console.error(err);
    });
  }

  getSymptomsCheckedBoxes(){
    let checkboxes = document.querySelectorAll(".check-symptoms.checkbox-checked");
    let checkboxesId = [];
    for(let i = 0; i < checkboxes.length; i++){
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }

  getCasesCheckedBoxes(){
    let checkboxes = document.querySelectorAll(".check-cases.checkbox-checked");
    let checkboxesId = [];
    for(let i = 0; i < checkboxes.length; i++){
      checkboxesId.push((checkboxes[i]).getAttribute("ng-reflect-value"));
    }

    return checkboxesId;
  }

  confirmar(){
    //this.getDiagnostic();
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
  }

}
