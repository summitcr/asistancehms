import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StaffTicketPage } from '../staff-ticket/staff-ticket.page';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
})
export class StaffPage implements OnInit {

  constructor(public modalController: ModalController) {}

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: StaffTicketPage,
    });
    return await modal.present();
  }


  goToStaffTicket(){
    this.presentModal()
  }

}
