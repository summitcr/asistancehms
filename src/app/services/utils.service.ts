import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  params  = {
    serverurl : "",
    registerurl: "",
    loginurl:"" ,
    userurl:"",
    beaconurl:"",
    gatewayurl:"",
    asseturl:"",
    pointsurl:"",
    mapurl:"",
    uploadurl:"",
    fileurl:"",
    typesurl:"",
    schedulesurl:"",
    staffurl:"",
    counter:"",
    tbeacon:"",
    alerturl:"",
    trackerurl:"",
    delayurl:"",
    operationurl:"",
    charturl:"",
    assetsalerturl:"",
    assetshistoryurl:"",
    pacienthistoryurl:"",
    pointinfourl:"",
    pointgeneralurl:"",
    pointgeneralurlpacients:"",
    pacientspecificurl:"",
    charalertsviewsurl:"",
    charassetspointsurl:"",
    charspecificpointsurl:"",
    pointspecificurl:"" ,
    trackerhistory:"" ,
    category:"" ,
    subcategory:"" ,
    type:"",
    status:"",
    roles:"",
    permissions:"",
    priority:"",
    personalert:"",
    assetalert:"",
    heartrate:""

   };

   mapwizeParams = {
      searchdirection:""
   }
  constructor() { 
    var newserverURL = 'http://35.184.147.166/summit/api/';
    this.params.serverurl = newserverURL;
    this.params.registerurl = newserverURL+"register";
    this.params.loginurl = newserverURL+"users/login";
    this.params.userurl = newserverURL+"users";
    this.params.beaconurl = newserverURL+"beacons";
    this.params.gatewayurl = newserverURL+"gateways";
    this.params.asseturl = newserverURL+"assets";
    this.params.mapurl = newserverURL+"maps";
    this.params.pointsurl = newserverURL+"points";
    this.params.uploadurl = newserverURL+"upload";
    this.params.fileurl = newserverURL+"files";
    this.params.typesurl = newserverURL+"types";
    this.params.schedulesurl = newserverURL+"schedules";
    this.params.staffurl = newserverURL+"people";
    this.params.counter = newserverURL+"counter";
    this.params.tbeacon = newserverURL+"tbeacon";
    this.params.alerturl = newserverURL+"alert";
    this.params.trackerurl = newserverURL+"tracker";
    this.params.delayurl = newserverURL+"delay";
    this.params.operationurl = newserverURL+"operation";
    this.params.charturl = newserverURL+"char1";
    this.params.assetsalerturl = newserverURL+"assetalert";
    this.params.assetshistoryurl = newserverURL+"assetshistory";
    this.params.pacienthistoryurl = newserverURL+"pacientshistory";
    this.params.pointinfourl = newserverURL+"pointinfo";
    this.params.pointgeneralurl = newserverURL+"pointgeneral";
    this.params.pointgeneralurlpacients = newserverURL+"pointgeneralpacient";
    this.params.pacientspecificurl = newserverURL+"/points/summary/people";
    this.params.pointspecificurl = newserverURL+"pointinfo";
    this.params.charalertsviewsurl = newserverURL+"charalertsviews";
    this.params.charassetspointsurl = newserverURL+"charassetspoints";
    this.params.charspecificpointsurl = newserverURL+"charspecificpoints";
    this.params.trackerhistory = newserverURL+"trackerhistory";
    this.params.category = newserverURL+"categories";
    this.params.subcategory = newserverURL+"subcatergories";
    this.params.type = newserverURL+"types";
    this.params.status = newserverURL+"status";
    this.params.permissions = newserverURL+"permissions";
    this.params.roles = newserverURL+"roles";
    this.params.priority = newserverURL+"priorities";
    this.params.personalert = newserverURL+"person_alert";
    this.params.assetalert = newserverURL+"asset_alert";
    this.params.heartrate = newserverURL+"heartratehistories";

    var mapwizeurl = "https://api.mapwize.io/v1/";
    var apikey= "?api_key=439578d65ac560a55bb586feaa299bf7";
    this.mapwizeParams.searchdirection = mapwizeurl+ "directions"+apikey;


  }//fin de bob



}//fin de class439578d65ac560a55bb586feaa299bf7
