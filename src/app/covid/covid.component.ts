import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss'],
})
export class CovidComponent implements OnInit {
  router: any;

  constructor() { }

  ngOnInit() {}

  public event = {
    month: '2020-01-01'
    
  }

}
