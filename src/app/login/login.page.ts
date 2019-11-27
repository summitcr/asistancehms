import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pages = [
    {
      title: 'Home',
      url: '/menu/first/tabs/tab1'
    },
  ];

  pdata: any;
  cedula: any;
  userdata: any;

  constructor(private storage: Storage,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private service: CrudService,
    private params: UtilsService,
    private router: Router,
    private toast: Toast) {

  }

  ngOnInit() {
  }
  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }
  login() {

    this.service.get(this.params.params.staffurl + "/asocieted/cid/" + this.cedula).subscribe((resp) => {

      this.userdata = resp;

      this.storeService.localSave(this.localParam.localParam.userLogged, this.userdata);
      this.storeService.localSave(this.localParam.localParam.alerts, 10);

      this.router.navigateByUrl('/menu/first/tabs/tab1/' + '0');

      console.log(this.userdata);
    }, (err) => {
      console.error(err);
      this.alert(JSON.stringify(err));
    });
  }
}// fin de la class
