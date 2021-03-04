import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonBackdrop, ModalController, ToastController } from '@ionic/angular';
import {BottomSheetComponent} from '../bottom-sheet/bottom-sheet.component'

import { ModalNotificationPage } from '../modal-notification/modal-notification.page';
import { CrudService } from '../services/crud.service';
import { IconsService } from '../services/icons.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { UtilsService } from '../services/utils.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../services/authentication.service';

export interface PlaceInfo {
  placeId: String,
  lat: String,
  long: String
}
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  placeInfo: PlaceInfo = {
    placeId: "",
    lat: "",
    long: ""
  }
  services = [];
  options = [
    {
      id:1,
      name: 'Solicitar silla de Ruedas',
    },
    {
      id:2,
      name: 'Solicitar Ayudante',
    },
  ]
  backdropBool = false;
  hasAsist = false;
  asistance:Object;

  @ViewChild("bottomSheet",{static:false}) bottomSheet:BottomSheetComponent;

  constructor(
    private router: Router,
    private toastController: ToastController,
    public modalController: ModalController,
    private iconService: IconsService,
    private crudService: CrudService,
    private params: UtilsService,
    private storageService: StorageService,
    private localParams: UtilStorageService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private auth: AuthenticationService,
    public actionSheetController: ActionSheetController,
    // public bottomSheet: BottomSheetComponent,
  ) { }

  ngOnInit() {
    this.crudService.get(this.params.params.ticketServices).subscribe((resp: []) => {
      this.services = resp;
      this.services = this.iconService.setIconsToServices(this.services);
    })
    // this.presentToastWithOptions()
  }

  toGo(route) {
    this.router.navigateByUrl(route);
  }

  getMeATicket(service) {
    this.storage.keys().then(data => console.log(data))
    this.hasTicket().then(ticketStatus => {
      if (ticketStatus == null) {
        let id = service.serviceId;
        this.placeInfo.placeId=service.icon.placeId;
        this.placeInfo.lat=service.icon.lat;
        this.placeInfo.long=service.icon.long;
        this.storageService.localSave(this.localParams.localParam.places, this.placeInfo);
        this.router.navigate(['/coronavirus'], { state: { data: { id } } });
      } else {
        this.showAlert("Ya posée un ticket", "Por favor revise la informacion de su ticket activo.", null)
      }
    });
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'En caso de embarazo',
      message: 'Por favor llenar la siguiente encuesta.',
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        }, {
          side: 'end',
          text: 'Ir',
          role: 'ok',
          handler: () => {
            this.router.navigateByUrl("/prenatal-control");
          },
        }
      ]
    });
    toast.present();
  }
  goPrenal() {
    this.router.navigateByUrl("/prenatal-control");
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationPage,
      cssClass: 'my-modal-class',
      animated: true
    });
    return await modal.present();
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

  goToIndoors() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/0');
  }

  hasTicket() {
    return this.storageService.localGet(this.localParams.localParam.createdTicket);
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  openBottomSheet(){
    this.bottomSheet.open();
    this.backdropBool = true;
  }

  selectOption(id){
    console.log("sending to api");
    this.bottomSheet.close();
    this.hasAsist=true;
    setTimeout(()=>{
      this.asistance = {
        person:{
          id:123,
          name: 'Elias',
          lastname: 'Guerrero Hernandez',
          ocupation: 'Enfermero',
        },
        type: id == 1 ? 'Silla de ruedas' : 'Ayudante' 
      }
    },1500);
  }

  consoleado(evt) {
    const backDrop = <IonBackdrop>evt.srcElement;
    backDrop.stopPropagation = true;
    backDrop.tappable = true;
    backDrop.visible = false;

    console.log(evt);
    console.log(backDrop.ionBackdropTap);
  }

}
