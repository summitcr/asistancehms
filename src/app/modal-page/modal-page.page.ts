import { Component, OnInit, AfterViewInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
declare var MapwizeUI: any;
export interface Asset {
  name: String,
  notes: String,
  sku: String,
  category: String,
  subcategoryid: String,
  identifier: String,
  code: String,
  beaconid: String,
  statusid: String
}
@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit{
  
  assetModel: Asset = {
    name: '',
    notes: '',
    sku: '',
    category: '',
    subcategoryid: '',
    identifier: '',
    code: '',
    beaconid: '',
    statusid: ''
  }
  data: any;
  statues: any;
  selectedStatus: any;
  selected: any;

 
  constructor(
    private modalController:ModalController,
    private services: CrudService,
    private params: UtilsService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController)
     { 
    
    }

  ngOnInit() {
    this.getStatus();
    console.log(`${JSON.stringify(this.data)}`);
    
  }
 
  closeModal(){
this.modalController.dismiss();
  }
  getStatus() {
    this.services.get(this.params.params.searchStatus).subscribe((resp) => {
      this.statues = resp;
      console.log(this.statues);
      this.selectedStatus=this.data.statusid;
    }, (err) => {
      alert("error");
      console.error(err);
    });
  }
  editStatus() {
   
    this.assetModel.name = this.data.name;
    this.assetModel.notes = this.data.notes;
    this.assetModel.sku = this.data.sku;
    this.assetModel.category = this.data.categoryid;
    this.assetModel.subcategoryid = this.data.subcategoryid;
    this.assetModel.code = this.data.code;
    this.assetModel.identifier = this.data.identifier;
    this.assetModel.beaconid = this.data.beaconid;
    this.assetModel.statusid = this.selectedStatus;
    this.services.put(this.params.params.asseturl + "/" + this.data.id, this.assetModel).subscribe(() => {
      this.popUpExit();
    }, (err) => {
    
      console.error(err);
    });
  }
  async presentLoadingDefaults() {
    let loading = await this.loadingCtrl.create({
      message: 'Se ha editado con éxito'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
     
    }, 4000);
  }
  async popUpExit() {
    let exitPopUp = await this.alertCtrl.create({
      header: 'Finalizado',
      subHeader: '',
      cssClass: 'myclass',
      message:
      '<img class="myclass" src="assets/img/confirmed.png"></img><br> <br><h6>Se ha editado con éxito</h6>',
      buttons: [{
        text: 'Ok',
        role: 'OK',
        handler: () => {
          this.modalController.dismiss();
        }
      }
      ]
    });
    await exitPopUp.present();
  }
}//fin de la class
