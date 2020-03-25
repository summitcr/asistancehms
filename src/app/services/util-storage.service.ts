import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilStorageService {
  localParam = {
    userLogged:"",
    alerts:"",
    alertsId:"",
    gatewaybeacons:"",
    lastBeacon:"",
    symptoms:"",
    anotherCases:"",
    diagnostic:"",
  }

  constructor() { 
    this.localParam.userLogged = "user-logged";
    this.localParam.alerts = "alert-amount";
    this.localParam.alertsId = "alerts-id";
    this.localParam.gatewaybeacons = "gatewaybeacons";
    this.localParam.lastBeacon = "last-beacon";
    this.localParam.symptoms = "symptoms";
    this.localParam.anotherCases = "another-cases";
    this.localParam.diagnostic = "diagnostic";
  }
}
