import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.page.html',
  styleUrls: ['./confirmed.page.scss'],
})
export class ConfirmedPage implements OnInit {

  insured: any;

  constructor(private router: Router,
    private storeService: StorageService,
    private localParam: UtilStorageService,) { }

  ngOnInit() {

  }

  go(){
    this.storeService.localGet(this.localParam.localParam.insured).then((resp) => {
      this.insured = resp;
      if(this.insured == true){
        this.router.navigateByUrl('/menu/first/tabs/tab1/'+'0');
      }else if (this.insured == false){
        this.router.navigateByUrl('login');
      }
    }, (err) => {
      console.error(err);
    });
  }

}
