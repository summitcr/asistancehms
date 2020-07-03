import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';

export interface NoRegisteredDiagnostic {
  identifierType: String,
  identifier: String,
  name: String,
  age: String,
  telephone: String,
  address: String,

}

@Component({
  selector: 'app-registro-covid',
  templateUrl: './registro-covid.page.html',
  styleUrls: ['./registro-covid.page.scss'],
})
export class RegistroCovidPage implements OnInit {

  noRegisteredDiagModel: NoRegisteredDiagnostic = {
    identifierType: '',
    identifier: '',
    name: '',
    age: '',
    telephone: '',
    address: '',

  }

  statuses: any;
  userData: any;
  userType: any;
  userCed: any;
  userName: any;
  userTel: any;
  userAddress: any;
  userStatus: any;
  userEdad: any;
  noInsuredUser: any;
  diagnosticExists: any;
  myForm: FormGroup;
  registroPacientes: any;

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

  ngOnInit() {

  }

  getStatus(value) {
    this.userStatus = value;
    console.log(this.userStatus);
  }

  //Metodo que busca el numero de cedula de la persona en la base de datos para verificar si se encuentra
  //registrado o no, si no se encuentra registrado procede a crear el diagnostico
  confirmData() {
    let userIdentifier = this.userCed;
    this.services.get(this.params.params.staffurl + "/cid/" + userIdentifier).subscribe((resp) => {
      this.userData = resp;

      if (this.userData) {
        this.presentAlert();
      }
    }, (err) => {
      if (err.status == 404) {
        this.services.get(this.params.params.noRegisteredDiagnostics + '/' + userIdentifier).subscribe((resp) => {
          this.diagnosticExists = resp;

          if (this.diagnosticExists) {
            this.presentAlert();
            //this.router.navigateByUrl('/login');
          }

        }, (err) => {
          if (err.status == 404) {
            // this.noRegisteredDiagModel.statusId = this.userStatus;
            this.noRegisteredDiagModel.name = this.userName;
            this.noRegisteredDiagModel.identifier = this.userCed;
            this.noRegisteredDiagModel.telephone = this.userTel;
            this.noRegisteredDiagModel.address = this.userAddress;

            this.services.save(this.params.params.noRegisteredDiagnostics, this.noRegisteredDiagModel).subscribe((resp) => {
              this.noInsuredUser = resp;
              this.storeService.localSave(this.localParam.localParam.insuredUser, this.noInsuredUser);
              this.router.navigateByUrl('/Covid-19');
            }, (err) => {
              console.error(err);
            });
          }
        });
      }
    });
  }

  savePaci() {
    this.noRegisteredDiagModel.identifierType = this.userType;
    this.noRegisteredDiagModel.identifier = this.userCed;
    this.noRegisteredDiagModel.name = this.userName;
    this.noRegisteredDiagModel.age = this.userEdad;
    this.noRegisteredDiagModel.telephone = this.userTel;
    this.noRegisteredDiagModel.address = this.userAddress;
    this.services.save(this.params.params.registroPacient, this.noRegisteredDiagModel).subscribe((resp) => {
      this.registroPacientes = resp;
      console.log(this.registroPacientes);
      this.storeService.localSave(this.localParam.localParam.insuredUser, this.registroPacientes);
      this.presentConfirm();
    }, (err) => {
      console.error(err);
    });
  }
  saveData() {
    console.log(this.myForm.value);
  }

  private createMyForm() {
    return this.formBuilder.group({
      tipo: ['', Validators.required],
      name: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      edad: ['', Validators.required],
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      subHeader: '',
      message:
        'Usted se encuentra registrado o ya realizó un diagnóstico.',
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
  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      subHeader: '',
      message:
        'Bienvenido(a), proceda a llegar la siguiente encuesta',
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.router.navigateByUrl('/coronavirus');
          //console.log('you clicked me');
        }
      },
      ]
    });
    await alert.present();
  }
}// fin

