import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationPage } from '../modal-notification/modal-notification.page';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {}
  closeModal(){
    this.modalController.dismiss();
      }

      async openModal(){
        const modal= await this.modalController.create({
      component: ModalNotificationPage,
        });
        modal.present();
      }
}
