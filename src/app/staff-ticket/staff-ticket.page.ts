import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  @Input() id: string;
  @Input() value: Object;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
