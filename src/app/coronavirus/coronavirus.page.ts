import { Component, OnInit } from '@angular/core';
import { UtilStorageService } from '../services/util-storage.service';
import { StorageService } from '../services/storage.service';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Diagnostic {
  statusId: number,
  patientId: String
}

@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.page.html',
  styleUrls: ['./coronavirus.page.scss'],
})
export class CoronavirusPage implements OnInit {

  diagnosticModel: Diagnostic = {
    statusId: null,
    patientId: ''
  }

  userLogged: any;
  diagnostic: any;
  diagnosticExists: any;
  myForm: FormGroup;
  constructor(private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private router: Router,
    public formBuilder: FormBuilder,) {
      this.myForm = this.createMyForm();
    }

  ngOnInit() {
    this.getUserLogged();
  }

  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.userLogged = resp;

    }, (err) => {
      console.error(err);
    });
  }

  healthyStatus(){
    let userId = this.userLogged.person.identifier;
    this.diagnosticModel.statusId = 1;
    this.diagnosticModel.patientId = userId;

    this.services.get(this.params.params.diagnostics+'/'+userId).subscribe((resp) => {
      this.diagnosticExists = resp;

      if(this.diagnosticExists){
        console.log("Ya haz hecho el diagnostico");
        this.router.navigateByUrl('/menu/first/tabs/tab1/0');
      }

    }, (err) => {
      if(err.status == 404) {
        this.services.save(this.params.params.diagnostics, this.diagnosticModel).subscribe(() => {
          console.log("Se agregó el diagnostico");
        }, (err) => {
          console.error(err);
        });
      } 
    });

  }

  unhealthyStatus(){
    let userId = this.userLogged.person.identifier;
    this.diagnosticModel.statusId = 2;
    this.diagnosticModel.patientId = userId;

    this.services.get(this.params.params.diagnostics+'/'+userId).subscribe((resp) => {
      this.diagnosticExists = resp;

      if(this.diagnosticExists){
        console.log("Ya haz hecho el diagnostico");
        this.router.navigateByUrl('/menu/first/tabs/tab1/0');
      }

    }, (err) => {
      if(err.status == 404) {
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
      name: ['', Validators.required],
     cedula: ['', Validators.required],
      /*email: ['', Validators.compose([
        Validators.maxLength(70),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),Validators.required
      ])],*/
      estado: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }
}//fin de la class
