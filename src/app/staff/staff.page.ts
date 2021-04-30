import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StaffTicketPage } from '../staff-ticket/staff-ticket.page';
import { SocketStaffService, SocketStaff } from '../services/socket-staff.service'

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
})
export class StaffPage implements OnInit {
  type: string;
  peopleAssets: any;
  selected: any;
  socket: SocketStaff
  notificationsChanges = new Map();


  constructor(
    public modalController: ModalController,
    private router: Router,
    private services: CrudService,
    private params: UtilsService,
    public socketService: SocketStaffService
  ) {

  }

  async ngOnInit() {
    this.type = 'All';
    this.filterAssetStaff('Silla de Ruedas');
    this.socket = await this.socketService.createSocket();
    this.socket.connect();

    this.socket.on('change', (data) => {
      const { _id: id, ...rest } = data
      this.notificationsChanges.set(id, rest)
    })
  }

  async presentModal(id, value) {
    const modal = await this.modalController.create({
      component: StaffTicketPage,
      componentProps: {id, value}
    });
    return await modal.present();
  }

  convertMapToArray (map) {
    return [...map]
  }

  goMap(item) {
    //console.log(item)
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + item.id);
  }

  goToStaffTicket(ticketFromMap) {
    const [id, value] = ticketFromMap
    console.log(id)
    console.log(value)
    this.presentModal(id, value)
  }
  goToIndoors() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/0');
  }
  segmentChanged(ev: any) {
    this.type = ev.detail.value;
    console.log('Segment changed', ev);
  }
  filterAssetStaff(datos: string) {
    const url = datos == 'STAFF' ? this.params.params.people : this.params.params.searchAssets;
    const filter = datos == 'STAFF' ? 'category' : 'subcategory';
    this.services.get(url).subscribe((resp: []) => {
      let newArray = [];
      resp.forEach(item => {
        if (item[filter] == datos) {
          newArray.push(item);
        }
      });

      this.peopleAssets = newArray;
      console.log(this.peopleAssets);
    }, (err) => {
      console.error(err);
    });
  }
  async presentEditModal(items) {
    const modal = await this.modalController.create({
      component: ModalPagePage,
      showBackdrop: true,
      mode: "ios",
      cssClass: 'modal-class',
      componentProps: {
        data: items
      }
    });
    modal.onWillDismiss().then((data) => {
      console.log(data);
      //custom code
    });
    return await modal.present();
  }
}//fin de la class 
