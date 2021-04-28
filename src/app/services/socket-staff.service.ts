import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
  })
export class SocketStaffService extends Socket {
  constructor(userId:string) {
    console.log('se ejecuto el constructor')
    const options = {
      path:'/stream',
      reconnection: true,
      reconnectionAttempts: 5,
      auth:{userId},
    }
    super({ url: 'http://localhost:4000/assistance', options });
  }
}

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketStaffService {

//   constructor() { }
// }
