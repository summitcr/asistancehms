import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StaffTicketPage } from '../staff-ticket/staff-ticket.page';
import { SocketStaffService } from '../services/socket-staff.service'

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
})
export class StaffPage implements OnInit {

  socket:SocketStaffService;

  constructor(public modalController: ModalController,) {
    this.socket = new SocketStaffService('6050efce420fd8003292aa83');
  }

  ngOnInit() {
    this.socket.connect();
    this.socket.on('on conection', (data)=>{
      console.log(data)
    })
    this.socket.on('change', (data)=>{
      console.log(data)
    })
    
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
