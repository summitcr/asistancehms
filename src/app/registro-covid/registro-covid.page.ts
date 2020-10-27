import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavController, AlertController, IonSelect } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';
import { UbicacionService } from '../services/ubicacion.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroCovidPage implements OnInit {

  @ViewChild('provinceSelect', { static: false }) provinciaSelect: IonSelect
  @ViewChild('cantonSelect', { static: false }) cantonSelect: IonSelect
  @ViewChild('distritoSelect', { static: false }) distritoSelect: IonSelect

  d: Date = new Date();

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

  disableCantonSelect = true;
  disableDistritoSelect = true;
  provincia: any;
  cantonesList = [];
  distritosList = [];
  direction: any;
  registroForm: FormGroup;
  enableRegisterForm: boolean = false;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private router: Router,
    private alertCtrl: AlertController,
    private apiUbicacion: UbicacionService) {
    this.myForm = this.createMyForm();
    // this.loger();
  }

  ngOnInit() {
    console.log(this.d);
  }

  getStatus(value) {
    this.userStatus = value;
    console.log(this.userStatus);
  }

  GenerateCantones() {
    this.cantonesList = [];
    if (this.provinciaSelect.value != undefined)
      this.apiUbicacion.getCantones(this.provinciaSelect.value.id).then((resp) => {
        Object.keys(resp).map((value, index, array) => {
          this.cantonesList.push({ id: value, value: resp[value] });
        });
        console.log(this.cantonesList);
        this.disableCantonSelect = false;
      });
    this.cantonSelect.value = undefined;
    this.distritoSelect.value = undefined;
  }

  GenerateDistritos() {
    this.distritosList = [];
    if (this.provinciaSelect.value != undefined && this.cantonSelect.value != undefined)
      this.apiUbicacion.getDistritos(this.provinciaSelect.value.id, this.cantonSelect.value.id).then((resp) => {
        Object.keys(resp).map((value, index, array) => {
          this.distritosList.push({ id: value, value: resp[value] });
        });
        console.log(this.distritosList);
        this.disableDistritoSelect = false;
      });
    this.distritoSelect.value = undefined;
  }

  GenerateDirection(provinceSelect, cantonSelect, distritoSelect) {
    let province = provinceSelect.value != undefined ? provinceSelect.value.value : '';
    let canton = cantonSelect.value != undefined ? cantonSelect.value.value : '';
    let distrito = distritoSelect.value != undefined ? distritoSelect.value.value : '';
    this.direction = `${province}, ${canton}, ${distrito}`;
    console.log(this.direction);
    this.userAddress = this.direction
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

  confirmButton(event) {
    if (this.valideteCedula()) {
      this.savePaci();
    } else {
      this.showAlert("No esta registrado", "Debe de completar el formulario");
      this.registroForm.controls.name.setValidators(Validators.required);
      this.registroForm.controls.telefono.setValidators(Validators.required);
      this.registroForm.controls.direccion.setValidators(Validators.required);
      this.registroForm.controls.edad.setValidators(Validators.required);
      this.registroForm.controls.provincia.setValidators(Validators.required);
      this.registroForm.controls.canton.setValidators(Validators.required);
      this.registroForm.controls.distrito.setValidators(Validators.required);
      this.registroForm.updateValueAndValidity();
      this.myForm.updateValueAndValidity();
      console.log(this.myForm);
      event.target.innerHTML = "Registrar";
      this.enableRegisterForm = true;
    }
  }

  valideteCedula() {
    const ced = this.myForm.controls.cedula.value;
    console.log(ced);
    if (ced === '102340567') {
      return true
    } else {
      return false
    }
  }

  saveData() {
    console.log(this.myForm.value);
  }

  private createMyForm() {
    return this.formBuilder.group({
      tipo: ['', Validators.required],
      cedula: ['', Validators.required],
      registro: this.registroForm = new FormGroup({
        name: new FormControl(''),
        telefono: new FormControl(''),
        direccion: new FormControl(''),
        edad: new FormControl(''),
        provincia: new FormControl(undefined),
        canton: new FormControl(undefined),
        distrito: new FormControl(undefined),
      }, Validators.required)
    });
  }

  loger() {
    setInterval(() => {
      console.log(this.myForm.controls.registro);
    }, 2000);
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
      header: 'Aviso',
      subHeader: '',
      message:
        'Bienvenido(a), proceda a seleccionar una de las siguientes encuestas',
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.router.navigateByUrl('/servicios');
          //console.log('you clicked me');
        }
      },
      ]
    });
    await alert.present();
  }

  async showAlert(header?: string, msg?: string, subHeader?: string) {
    const alert = await this.alertCtrl.create({
      header: header || "",
      subHeader: subHeader || "",
      message: msg || "",
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
}// fin

