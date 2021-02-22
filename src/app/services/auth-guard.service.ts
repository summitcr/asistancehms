import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from './authentication.service';
import { Toast } from '@ionic-native/toast/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate  {

  constructor(private storage: Storage,
     private plt: Platform,
     public auth: AuthenticationService,
     private router: Router,
     private toast: Toast) { }
 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('mean-token').then((val) => {
         console.log("ced"+val);
          if (val) {
           // this.alert('ced'+val);
            resolve(true);
          } else {
            this.router.navigateByUrl('/login');
            resolve(false);
          }
        });
      });
    });}
    alert(msg: string) {
      this.toast.show(msg, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }
}//Fin de la class
