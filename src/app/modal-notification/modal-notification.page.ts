import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

declare var MapwizeUI: any;

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.page.html',
  styleUrls: ['./modal-notification.page.scss'],
})
export class ModalNotificationPage implements OnInit, AfterViewInit {

  constructor(
    private modalController: ModalController,
    private router: Router
  ) { }

  ngAfterViewInit() {
  }
  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  goToTicket(ticket) {
    this.modalController.dismiss();
    this.router.navigateByUrl(`/menu/first/tabs/tab1/${ticket}`);
  }

}//fin de la class
