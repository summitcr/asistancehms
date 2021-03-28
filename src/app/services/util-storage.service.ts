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
    insured:"",
    insuredUser:"",
    createdTicket:"",
    ticketStatus:"",
    ticketServices:"",
    mean:"",
    places:"",
    tutorial:"",
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
    this.localParam.insured = "insured";
    this.localParam.insuredUser = "insured-user";
    this.localParam.createdTicket = "created-ticket";
    this.localParam.ticketStatus = "ticket-status";
    this.localParam.ticketServices = "ticket-services";
    this.localParam.mean="mean-token";
    this.localParam.places="placeId";
    this.localParam.tutorial="tutorial";
  }
}
