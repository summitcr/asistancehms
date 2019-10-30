import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterEvent } from '@angular/router';

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

  constructor(private router: Router) { 
    this.router.events.subscribe((event: RouterEvent)=>{
      if(event && event.url){
          this.selectedPath=event.url;
      }
    });
  }

  ngOnInit() {
  }

}
