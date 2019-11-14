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
  { title: 'Home',
url:'/menu/first'
},
{ title: 'Personas Asociadas',
url:'/menu/seconds'
},

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
    this.storage.get('wa-data').then((val) => {
      this.person = val;
    });
  }

  logout(){
    //this.storage.clear();
    this.router.navigateByUrl('/login');
  }

}
