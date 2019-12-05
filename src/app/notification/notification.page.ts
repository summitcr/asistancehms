import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalNotificationPage } from '../modal-notification/modal-notification.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  pages=[
    { title: 'Home',
    url: '/menu/first/tabs/tab1'
    },
  ];
  constructor(private modalController: ModalController, private router: Router, private navCrtl: NavController) { }

  ngOnInit() {
  }
  async openModal(){
    const modal= await this.modalController.create({
  component: ModalNotificationPage,
    });
    modal.present();
  }
  go() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/'+'2');
  }
  
}//fin de la class
