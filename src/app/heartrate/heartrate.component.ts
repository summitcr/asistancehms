import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-heartrate',
  templateUrl: './heartrate.component.html',
  styleUrls: ['./heartrate.component.scss'],
})
export class HeartrateComponent implements OnInit {
  pages=[
    { title: 'Home',
  url:'/menu/third'
  },];
  interval: any;
  view: any[] = [400, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = false;
  yAxisLabel = '';
  timeline = false;
  yScaleMax=80;
  yScaleMin = 50;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  multi: any[] = [
    {
      name: 'Ritmo',
      series: [{
        name: 5,
        value: 60
      }]
    }
  ];;

setData() {
  this.multi = [
    {
      name: 'Ritmo',
      series: [
        {
          name: "10:00",
          value: 60
        },
        {
          name: "10:05",
          value: 80
        },
        {
          name: "10:10",
          value: 50
        },
        {
          name: "10:15",
          value: 75
        },
        {
          name: "10:20",
          value: 70
        },
      ]
    }
  ];
}
timer() {
  this.interval = setInterval(() => {
    this.getHeartData();
  }, 20000);
}
getHeartData(){
  this.service.get(this.params.params.heartrate+"/lastest/").subscribe((resp:any[]) => {
    var data =  {
      name: "10:00",
      value: 70
    };
    this.multi[0].series.push(data);
  }, (err) => {
    console.error(err);
  });
}

  constructor( private router: Router,  private params: UtilsService,
    private service: CrudService, ) { 
  
  }

  ngOnInit() {
    this.getHeartData();
    this.timer();
  }
  go(id) {
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + id);
  }

}
