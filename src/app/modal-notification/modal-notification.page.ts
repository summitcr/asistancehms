import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

declare var MapwizeUI: any;

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.page.html',
  styleUrls: ['./modal-notification.page.scss'],
})
export class ModalNotificationPage implements OnInit, AfterViewInit {

  constructor(private modalController: ModalController) { }

  ngAfterViewInit() {
  }
  ngOnInit() {
  }
  closeModal() {
    this.modalController.dismiss();
  }
}//fin de la class
