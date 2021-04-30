import { Component, EventEmitter, OnInit } from '@angular/core';
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
      console.log('esta entrando al socket')
      data['viewed'] = false;
      let { _id: id, ...rest } = data
      rest['updatedAt'] = this.convertDateTimeZone(rest['updatedAt']);
      rest['createdAt'] = this.convertDateTimeZone(rest['createdAt']);
      this.notificationsChanges.set(id, rest)
      console.log(data);
    })
  }

  async presentModal(id, value) {
    value['viewed'] = true
    const modal = await this.modalController.create({
      component: StaffTicketPage,
      componentProps: {id, value}
    });
    return await modal.present();
  }

  convertMapToArray (map) {
    return [...map].sort((a, b)=>{
      const aDate = new Date(a[1].updatedAt).getTime();
      const bDate = new Date(b[1].updatedAt).getTime();
      return bDate - aDate;
    });
  }

  isRecent (ticket) {
    console.log(ticket['updatedAt'])
    const notiTime = new Date(ticket['updatedAt']).getTime();
    const nowDate = this.convertDateTimeZone();
    const nowTime = new Date(nowDate).getTime();
    const diffTime = nowTime - notiTime
    const diffSeconds = Math.floor( diffTime / 1000 );
    const diffMinutes = diffSeconds / 60;
    // console.log(diffMinutes)
    if (diffTime <= 0) return true;
    if (diffMinutes <= 10) return true;
    if (diffMinutes > 10) return false;
  }

  convertDateTimeZone (stringDate=undefined) {
    if(stringDate === undefined) return new Date().toLocaleString('en-US',{timeZone: 'America/Costa_Rica'});
    return new Date(stringDate).toLocaleString('en-US',{timeZone: 'America/Costa_Rica'});
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
