import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
declare var MapwizeUI: any;
@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit, AfterViewInit{
  
  mapwizeMap: any;
  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
     
      MapwizeUI.map({
        apiKey: '439578d65ac560a55bb586feaa299bf7',
        hideMenu: true,
        centerOnVenue: '5d7420b31a255c0050e14fc5'
  
      }).then(instance => {
        this.mapwizeMap = instance;
      
       
      });
    }, 1000);
  }
  closeModal(){
this.modalController.dismiss();
  }
}//fin de la class
