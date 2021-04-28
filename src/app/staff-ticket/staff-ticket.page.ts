import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-staff-ticket',
  templateUrl: './staff-ticket.page.html',
  styleUrls: ['./staff-ticket.page.scss'],
})
export class StaffTicketPage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }
  closeModal(){
    this.modalController.dismiss();
      }
}
