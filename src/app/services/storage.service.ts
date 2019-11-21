import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface iStorage {
  saveData();
  alertAmount();
}

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(private storage: Storage) {

  }

  localSave(key, data: any): void {
    this.storage.ready().then(() => {
      this.storage.set(key, data);
      console.log(data);
    });
  }

  localGet(key){
    return this.storage.get(key);
  }
}
