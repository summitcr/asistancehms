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
  selected:any;
  socket: SocketStaff
    
  constructor(
    public modalController: ModalController,
    private router: Router,
    private services: CrudService,
    private params: UtilsService,
    public socketService: SocketStaffService
    ) { 

    }

  async ngOnInit() {
    this.type='All';
    this.filterAssetStaff('Silla de Ruedas'); 
    this.socket = await this.socketService.createSocket();
    this.socket.connect();

    console.log(this.socket)
   
    // this.socket.on('connection', (data)=>{
    //   console.log(data)
    // })
    // this.socket.on('on connection', (data)=>{
    //   console.log(data)
    // })
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
goMap(item){
  //console.log(item)
  this.router.navigateByUrl('/menu/first/tabs/tab1/'+item.id);
}

  goToStaffTicket(){
    this.presentModal()
  }
  goToIndoors() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/0');
  }
  segmentChanged(ev: any) {
    this.type=ev.detail.value;
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
    modal.onWillDismiss().then((data)=>{
      console.log(data);
      //custom code
    });
    return await modal.present();
  }
}//fin de la class 
