import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-person-alert',
  templateUrl: './person-alert.component.html',
  styleUrls: ['./person-alert.component.scss'],
})
export class PersonAlertComponent implements OnInit {

  constructor(
    private service: CrudService,
    private params: UtilsService,) { }

  ngOnInit() {

  }

}
