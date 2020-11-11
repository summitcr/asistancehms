import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
pages=[
  { title: 'Inicio',
url:'/menu/first/tabs/tab1/'+'0',
icon:'home'
},


{ title: 'Servicios',
url:'/heart-rate',
icon:'apps'
}

];
selectedPath='';

  person: any;

  constructor(private router: Router, private storage: Storage) { 
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


}//fin de la class
