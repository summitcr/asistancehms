import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
declare var MapwizeUI: any;
@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.page.html',
  styleUrls: ['./modal-notification.page.scss'],
})
export class ModalNotificationPage implements OnInit, AfterViewInit {
 

  mapwizeMap: any;
  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   
     
      MapwizeUI.map({
        apiKey: '439578d65ac560a55bb586feaa299bf7',
        hideMenu: true,
        centerOnVenue: '5d7420b31a255c0050e14fc5'
  
      }).then(instance => {
        this.mapwizeMap = instance;
      
       
      });
    
  }
  closeModal(){
    this.modalController.dismiss();
      }
}//fin de la class
