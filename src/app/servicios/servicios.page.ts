import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { ModalNotificationPage } from '../modal-notification/modal-notification.page';
import { CrudService } from '../services/crud.service';
import { IconsService } from '../services/icons.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { UtilsService } from '../services/utils.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  services = [];

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
    private storage: Storage
  ) { }

  ngOnInit() {
    this.crudService.get(this.params.params.ticketServices).subscribe((resp:[]) =>{
      this.services = resp;
      this.services = this.iconService.setIconsToServices(this.services);
    })
    this.presentToastWithOptions()
  }

  toGo(route){
    this.router.navigateByUrl(route);
  }

  getMeATicket(service){
    this.storage.keys().then(data=>console.log(data))
    this.hasTicket().then( ticketStatus => {
      if (ticketStatus == null) {
        let id = service.serviceId;
        this.router.navigate(['/coronavirus'], { state: { data: { id } } });
      } else {
        this.showAlert("Ya posée un ticket","Por favor revise la informacion de su ticket activo.",null)
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

  hasTicket(){
    return this.storageService.localGet(this.localParams.localParam.createdTicket);
  }

}
