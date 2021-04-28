import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { StaffTicketPage } from '../staff-ticket/staff-ticket.page';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
})
export class StaffPage implements OnInit {
  type: string;
  peopleAssets: any;
  selected:any;

  constructor(public modalController: ModalController,
    private router: Router,
    private services: CrudService,
    private params: UtilsService,) {}

  ngOnInit() {
    this.type='All';
    this.filterAssetStaff('Silla de Ruedas'); 
   
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
