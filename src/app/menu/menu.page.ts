import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
pages=[
  { title: 'Home',
url:'/menu/first'
},
{ title: 'Personas Asociadas',
url:'/menu/seconds'
},

];
selectedPath='';

  person: any;

  constructor(private router: Router, private storage: Storage, private modalController:ModalController) { 
    this.router.events.subscribe((event: RouterEvent)=>{
      if(event && event.url){
          this.selectedPath=event.url;
      }
    });
  }

  ngOnInit() {
 
  }

  logout(){
    this.storage.clear();
    this.router.navigateByUrl('/login');
  }
async openModal(){
  const modal= await this.modalController.create({
component: ModalPagePage,
  });
  modal.present();
}

}//fin de la class
