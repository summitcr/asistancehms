import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { UtilStorageService } from './util-storage.service';

const TOKEN_KEY = 'auth-token';

export interface Token {
  userCed: string;
}
export interface userModel {
  identifierType: String,
  identifier: String,
  name: String,
  age: String,
  telephone: String,
  address: String,

}
interface TokenResponse {
  identifier: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  private token: string;
  userToken: any;
  user: any;
  constructor(private storage: Storage,
    private plt: Platform,
    private http: HttpClient,
    private storeService: StorageService,
    private localParam: UtilStorageService,) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
  private saveToken(token: string): void {
    this.storeService.localSave(this.localParam.localParam.mean, token);
  }
  checkToken() {
    this.storeService.localGet(this.localParam.localParam.mean).then((resp) => {
      this.user = resp;
console.log(this.userToken);
    }, (err) => {
      console.error(err);
    });
  }
  public getToken(): string {
    if (!this.token) {
      this.storeService.localGet(this.localParam.localParam.mean).then((resp) => {
        this.token = resp;

      }, (err) => {
        console.error(err);
      });

    }
    return this.token;
  }
  getTo() {
    this.storeService.localGet(this.localParam.localParam.mean).then((resp) => {
      this.userToken = resp;
      console.log(this.userToken);
    }, (err) => {
      console.error(err);
    });
  }
  // login() {
  //   return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
  //     this.authenticationState.next(true);
  //   });
  // }
  private request(method: 'post' | 'get', url: string, user?: userModel | Token): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(url, user);
    } else {
      base = this.http.get(url, { headers: { Authorization: `Bearer ${this.getTo()}` } });
    }

    const request = base.pipe(
      map((datas: TokenResponse) => {
        if (datas.identifier) {
          this.saveToken(datas.identifier);
        }
        return datas;
      })
    );

    return request;
  }
  public login(user: Token, url: string): Observable<any> {
    return this.request('get', url, user);
  }
  public logout(): void {
    this.token = '';
    this.storage.remove('insured-user');
    this.storage.remove('mean-token');
   
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
  public isLoggedIn(): boolean {

    const user = this.getToken();
    console.log(user);
    if (user) {
      return true;

    } else {
      return false;
    }
  }
}//fin de class
