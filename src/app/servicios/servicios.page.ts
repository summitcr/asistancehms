import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';

import { ModalNotificationPage } from '../modal-notification/modal-notification.page';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  constructor(
    private router: Router,
    private toastController: ToastController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.presentToastWithOptions()
  }

  toGo(route){
    this.router.navigateByUrl(route);
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

}
