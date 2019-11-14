import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pages=[
    { title: 'Home',
      url:'/menu/first'
    },
  ];

  cedula: any;
  userdata: any;

  constructor(private storage: Storage, private service: CrudService, private params: UtilsService, private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.service.get(this.params.params.staffurl + "/cid/" + this.cedula).subscribe((resp) => {
      this.userdata = resp;
      this.saveData(this.userdata);
      this.router.navigateByUrl('/menu/first');
      console.log(this.userdata);
    }, (err) => {
      console.error(err);
    });
  }

  private saveData(data: any): void {
    this.storage.set('wa-data', data);
   
  }

}
