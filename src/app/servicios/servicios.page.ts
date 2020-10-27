import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  constructor(
    private router: Router,
    private toastController: ToastController
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
          role: 'ok',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          side: 'end',
          text: 'Ir',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        }
      ]
    });
    toast.present();
  }

}
