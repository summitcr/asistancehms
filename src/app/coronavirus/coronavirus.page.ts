import { Component, OnInit } from '@angular/core';
import { UtilStorageService } from '../services/util-storage.service';
import { StorageService } from '../services/storage.service';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';

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

  constructor(private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,) {

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
    this.diagnosticModel.statusId = 4;
    this.diagnosticModel.patientId = userId;

    this.services.save('http://localhost:61362/api/diagnostics', this.diagnosticModel).subscribe(() => {
      console.log("Se agregó el diagnostico");
    }, (err) => {

    });
  }

  unhealthyStatus(){
    let userId = this.userLogged.person.identifier;
    this.diagnosticModel.statusId = 3;
    this.diagnosticModel.patientId = userId;
    this.services.save('http://localhost:61362/api/diagnostics', this.diagnosticModel).subscribe((resp) => {
      
      this.diagnostic = resp;
      this.storeService.localSave(this.localParam.localParam.diagnostic, this.diagnostic);

      console.log("Se agregó el diagnostico");
    }, (err) => {

    });
  }

}
