import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalNotificationPage } from '../modal-notification/modal-notification.page';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit, AfterViewInit {

  pages=[
    { title: 'Home',
    url: '/menu/first/tabs/tab1'
    },
  ];

  asociatedId: any;
  asociatedIdAlert: any;
  asociatedAlert: any;
  alertInfo = [];
  person: any;
  asocietedName: any;
  timeSpent: any;
  notification: string = "Notificaciones";

  constructor(private modalController: ModalController, 
    private router: Router, 
    private navCrtl: NavController,
    private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.getAsociatedId();
    this.getUserLogged();
    setTimeout(() => {
      this.getAsociatedAlerts();
    }, 1000);
  }

  go() {
    this.router.navigateByUrl('/menu/first/tabs/tab1/'+'2');
  }

  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      //console.log(this.person);
    }, (err) => {
      console.error(err);
    });
  }

  getAsociatedId(){
    this.storeService.localGet(this.localParam.localParam.alertsId).then((resp) => {
      this.asociatedId = resp;
      console.log(this.asociatedId);
    }, (err) => {
      console.error(err);
    });
  }

  getAsociatedAlerts(){
      let id;
      for(let i = 0; i < this.asociatedId.length; i++){
        id = this.asociatedId[i];
        this.services.get(this.params.params.beaconurl+"/tracker/person/alert/"+id).subscribe((resp) => {
          this.asociatedIdAlert = resp;
          this.asociatedAlert = this.asociatedIdAlert.alerts;
          
          if(this.asociatedAlert != null){
            this.alertInfo.push(this.asociatedAlert);
            console.log(this.alertInfo);
            this.timeSpent = this.transform(this.asociatedAlert.timespent);
            for(let x = 0; x < this.person.asocietedpeople.length; x++){
              if(this.person.asocietedpeople[x].id == id){
                this.asocietedName = this.person.asocietedpeople[x].name;
              }
            }
          }else if(this.asociatedAlert == null){
            this.notification = "No hay notificaciones";
          }
  
        }, (err) => {
          console.error(err);
        });
      }
  }

  times = {
    year: 31557600,
    mes: 2629746,
    dia: 86400,
    h: 3600,
    m: 60,
    s: 1
  }

  transform(seconds) {
    let time_string: string = '';
    let plural: string = '';
    for (var key in this.times) {
      if (Math.floor(seconds / this.times[key]) > 0) {
        if (Math.floor(seconds / this.times[key]) > 1) {
          plural = 's';
        }
        else {
          plural = '';
        }

        time_string += Math.floor(seconds / this.times[key]).toString() + ' ' + key.toString() + plural + ' ';
        seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);

      }
    }
    return time_string;
  }
  
}//fin de la class
