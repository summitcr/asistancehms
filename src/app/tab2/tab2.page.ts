import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
points: any;
  constructor( private services:CrudService, private params:UtilsService) { }

  ngOnInit() {
    this.getPoints();
  }
  getPoints() {

    this.services.get(this.params.params.pointsurl).subscribe((resp) => {
      this.points = resp;
      console.log(this.points);
    }, (err) => {
      alert("error");
      console.error(err);
    });
  }
}
