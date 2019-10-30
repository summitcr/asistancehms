import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const endpoint = 'http://34.70.117.247/summit/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CrudService {


  constructor( private http:HttpClient) { }


  get(url){

    return this.http.get(url);
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
