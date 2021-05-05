import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StaffTicketPage } from '../staff-ticket/staff-ticket.page';
import { SocketStaffService, SocketStaff } from '../services/socket-staff.service'
import { StorageService } from '../services/storage.service'
import { UtilStorageService } from '../services/util-storage.service'
import * as moment from 'moment';

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
  recentList = [];
  previousList = [];

  constructor(
    public modalController: ModalController,
    private router: Router,
    private services: CrudService,
    private params: UtilsService,
    public socketService: SocketStaffService,
    private storage: StorageService,
    private utilStorage: UtilStorageService
  ) {
  }

  async ngOnInit() {
    this.type = 'All';
    this.filterAssetStaff('Silla de Ruedas');
    this.socket = await this.socketService.createSocket();
    this.socket.connect();

    await this.getNotificationsFromStorage();
    
    this.socket.on('change', (data) => {
      console.log('esta entrando al socket')
      this.saveNotificationsToStorage();
      data['viewed'] = false;
      let { _id: id, ...rest } = data
      rest['updatedAt'] = this.convertDateTimeZone(rest['updatedAt']);
      rest['createdAt'] = this.convertDateTimeZone(rest['createdAt']);
      this.notificationsChanges.set(id, rest)
      this.serpareteRecentPrevious();
    })
  }

  async getNotificationsFromStorage(){
    const resp = await this.storage.localGet(this.utilStorage.localParam.notifications);
    console.log(resp)
    this.notificationsChanges = resp == Map ? resp : this.notificationsChanges 
  }

  saveNotificationsToStorage () {
    console.log('esta guardando')
    this.storage.localSave(this.utilStorage.localParam.notifications, 'guarda informacion')
  }

  serpareteRecentPrevious () {
    this.recentList = [];
    this.previousList = [];
    this.notificationsChanges.forEach((value,key)=>{
      if (this.isRecent(value['updatedAt'])) this.recentList.push([key,value])
      if (!this.isRecent(value['updatedAt'])) this.previousList.push([key,value])
    });
    this.sortArrayByDate(this.recentList);
    this.sortArrayByDate(this.previousList);
  }

  async presentModal(id, value) {
    value['viewed'] = true
    const modal = await this.modalController.create({
      component: StaffTicketPage,
      componentProps: {id, value}
    });
    return await modal.present();
  }

  sortArrayByDate (array) {
    return array.sort((a, b)=>{
      const aDate = new Date(a[1].updatedAt).getTime();
      const bDate = new Date(b[1].updatedAt).getTime();
      return bDate - aDate;
    });
  }

  isRecent (ticketTime) {
    const minuteDiff = moment().diff(moment(ticketTime),'minute')
    if (minuteDiff == 0) return true;
    if (minuteDiff <= 10) return true;
    if (minuteDiff > 10) return false;
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
