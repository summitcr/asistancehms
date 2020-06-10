import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const endpoint = 'http://35.184.147.166/summit/api/';
/*const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", 
    'Accept': 'application/json, text/plain',
    "cache-control": "no-cache", 
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers",
    "Access-Control-Allow-Credentials" : "true",
    "Access-Control-Allow-Methods" : "GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT",
  })
};*/
/*const httpOptions = {
  headers: new HttpHeaders({
    'Auth-token': 'd0516eee-a32d-11e5-bf7f-feff819cdc9f',
    'Authorization': 'Basic c3VwZXJhZG1pbjp1bGFu',
    'Content-Type':  'application/json'
  })
};*/

@Injectable({
  providedIn: 'root'
})
export class CrudService {


  constructor( private http:HttpClient) { }


  get(url){

    return this.http.get(url);
  }
  //Metodo get con header para probar los tiquetes
  getTicket(url){
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Auth-token':'d0516eee-a32d-11e5-bf7f-feff819cdc9f',
      'Authorization':'Basic c3VwZXJhZG1pbjp1bGFu'
    });
    /*const httpOptions = {
      headers: new HttpHeaders({
        'Auth-token': 'd0516eee-a32d-11e5-bf7f-feff819cdc9f',
        'Authorization': 'Basic c3VwZXJhZG1pbjp1bGFu',
        'Content-Type':  'application/json'
      })
    };*/
    return this.http.get(url, { headers: headers });
  }
  save(url,data:any){
    return  this.http.post(url,data, { headers: { }});
  }
  saveTicket(url, data:any){
    return this.http.post(url, data, { headers: { }});
  }
  xmlHttpPostRequest(url,formData:FormData ){
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                resolve(JSON.parse(xhr.response));
                 //return JSON.parse(xhr.response);
              } else {
                reject(JSON.parse(xhr.response));
              }
          }
      }
      xhr.open("POST",url, true);
      xhr.send(formData);
  });
  }

  
}// fin  de la class
