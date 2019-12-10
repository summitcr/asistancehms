import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';

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
  person: any;
  personAlert: any;
  bellAlert: number = 0;
  public loginForm: FormGroup;

  constructor(private storage: Storage,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private service: CrudService,
    private params: UtilsService,
    private router: Router,
    private toast: Toast,
    public formBuilder: FormBuilder)
     {
      this.loginForm = formBuilder.group({
        cedula: ['', Validators.required]
        
    });
  }

  ngOnInit() {
    this.getUserLogged();
    setTimeout(() => {
      if(this.person.person != null){
        this.router.navigateByUrl('/menu/first/tabs/tab1/'+'0');
      }
    }, 1000);
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
      //this.storeService.localSave(this.localParam.localParam.alerts, 10);
      this.getAsociatedAlerts();

      this.router.navigateByUrl('/menu/first/tabs/tab1/' + '0');

      console.log(this.userdata);
    }, (err) => {
      console.error(err);
      this.alert(JSON.stringify(err));
    });
  }

  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      //console.log(this.person);
    }, (err) => {
      console.error(err);
    });
  }

  getAsociatedAlerts(){
    let asociatedId = [];
    let id;
    for(let i = 0; i < this.userdata.asocietedpeople.length; i++){
      id = this.userdata.asocietedpeople[i].id;
      asociatedId.push(id);
      this.service.get(this.params.params.beaconurl+"/tracker/person/alert/"+id).subscribe((resp) => {
        this.personAlert = resp;
        if(this.personAlert.alerts.length < 1){
          for(let x = 0; x < this.personAlert.alerts.length; x++){
            if(this.personAlert.alerts[i].isResolved == false){
              this.bellAlert ++;
              this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
            }
          }
        }else if(this.personAlert.alerts.isResolved == false){
          this.bellAlert ++;
          this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
        }
        this.storeService.localSave(this.localParam.localParam.alertsId, asociatedId);
      }, (err) => {
        console.error(err);
      });
      
    }
  }
}// fin de la class
