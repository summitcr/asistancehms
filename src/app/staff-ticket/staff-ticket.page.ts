import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

interface TicketStaffInterface {
  _id?: string,
  status: string,
  assistance_type: {
    _id: string,
    name: string,
  },
  patient: {
    id: Number,
    identifier: string,
    identifierType: string,
    name: string,
    telephone: string,
  },
  init_location: string,
  lat: string,
  long: string,
  createdAt: string,
  updatedAt: string,
  placeId,
  assistant?: {
    name: string,
    _id: string,
    identifier: string,
  }
}

@Component({
  selector: 'app-staff-ticket',
  templateUrl: './staff-ticket.page.html',
  styleUrls: ['./staff-ticket.page.scss'],
})
export class StaffTicketPage implements OnInit {
date: any;
  @Input() id: string;
  @Input() value: Object;
  @Input() goMap: Function;

  constructor(private router:Router, private modalController: ModalController, private service:CrudService, private utils:UtilsService ) { }

  ngOnInit() {
    this.createDate();
  }
  createDate(){
    let d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    minutes = d.getMinutes().toString();

  let ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  minutes = minutes < '10' ? '0' + minutes : minutes;

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  if (minutes.length < 2)
    minutes = '0' + minutes;
    this.date=this.value['createdAt'];
    this.date = day + '-' + month + '-' + year + ' a las: ' + hour + ':' + minutes + ' ' + ampm;
    
  }

  finishedTicket () {
    console.log(`${this.utils.params.assistance_tickets}${this.id}`)
    this.service.put(`${this.utils.params.assistance_tickets}${this.id}`, {status: "FINISHED"}).subscribe((response) => {
      if (response['status'] == "FINISHED") this.closeModal();
    });
  }

  humanizeDate (date) {
    moment.locale('es')
    return moment(date).fromNow();
  }

  goToMap () {
    this.router.navigateByUrl(`/menu/first/tabs/tab1/${this.value['placeId']}`);
    this.closeModal();
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true,
      'placeId': this.value['placeId']
    });
  }
}
