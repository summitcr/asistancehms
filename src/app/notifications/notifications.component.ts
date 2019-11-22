import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationPage } from '../modal-notification/modal-notification.page';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  pages = [
    {
      title: 'Notifi',
      url: '/menu/first'
    },
  ];

  constructor(private modalController: ModalController, private router: Router,) { }

  ngOnInit() { }
  closeModal() {
    this.modalController.dismiss();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationPage,
    });
    return await modal.present();
  }
  go(){
    this.router.navigateByUrl('/menu/first');
  }
}
