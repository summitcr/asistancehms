import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-encuestas',
  templateUrl: './show-encuestas.page.html',
  styleUrls: ['./show-encuestas.page.scss'],
})
export class ShowEncuestasPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  toGo(route){
    this.router.navigateByUrl(route);
  }

}
