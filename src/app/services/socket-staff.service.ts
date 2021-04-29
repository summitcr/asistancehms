import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UtilsService } from "./utils.service"
import { UtilStorageService } from "./util-storage.service"
import { StorageService } from './storage.service'
import { url } from 'inspector';

@Injectable({
    providedIn: 'root'
  })
export class SocketStaffService {

  public url;
  public user;
  public socket;
  public options = {
    path: '/stream',
    reconnectionAttempts: 5,
    auth: undefined
  }

  constructor(
    private utilsService:UtilsService,
    private utilStorage:UtilStorageService,
    private localStorage: StorageService
  ) {}

  async createSocket () {
    if (!this.url) this.url = this.utilsService.params.socketAsisstance;
    if (!this.user) this.user = await this.localStorage.localGet(this.utilStorage.localParam.insuredUser);
    console.log(this.user.identifier+';')
    console.log(this.url)
    if (!this.options.auth) this.options.auth = {userId: this.user.identifier}
    this.socket = new SocketStaff(this.url, this.options);
    return this.socket;
  }

  getSocket () {
    return this.socket;
  }

  getUser () {
    return this.user;
  }
}

export class SocketStaff extends Socket {
  constructor(url, options){
    super({url, options})
  }
}

