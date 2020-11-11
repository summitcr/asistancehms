import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  params = {
    serverurl: "",
    registerurl: "",
    loginurl: "",
    userurl: "",
    beaconurl: "",
    gatewayurl: "",
    asseturl: "",
    pointsurl: "",
    mapurl: "",
    uploadurl: "",
    fileurl: "",
    typesurl: "",
    schedulesurl: "",
    staffurl: "",
    counter: "",
    tbeacon: "",
    alerturl: "",
    trackerurl: "",
    delayurl: "",
    operationurl: "",
    charturl: "",
    assetsalerturl: "",
    assetshistoryurl: "",
    pacienthistoryurl: "",
    pointinfourl: "",
    pointgeneralurl: "",
    pointgeneralurlpacients: "",
    pacientspecificurl: "",
    charalertsviewsurl: "",
    charassetspointsurl: "",
    charspecificpointsurl: "",
    pointspecificurl: "",
    trackerhistory: "",
    category: "",
    subcategory: "",
    type: "",
    status: "",
    roles: "",
    permissions: "",
    priority: "",
    personalert: "",
    assetalert: "",
    heartrate: "",
    gatewaybeacons: "",
    ticketCreate: "",
    ticketServices: "",
    ticketStatus: "",
    symptoms: "",
    anotherCases: "",
    diagnosticSymptoms: "",
    diagnosticCases: "",
    diagnostics: "",
    noRegisteredDiagSymtoms: "",
    noRegisteredDiagCases: "",
    noRegisteredDiagnostics: "",
    registroPacient: "",
    pacient_poll: " ",
    topicsInformations: "",
    chronicDiseases: "",
    currentDiseases: "",
    complications: "",
    prenatalCare_poll:"",
    topicsInformation_pacient:"",
    chronicDiseases_pacient:"",
    currentDiseases_pacient:"",
    complications_pacient:"",
    searchById:"",
    addOrEditPeople:"",
  };

  mapwizeParams = {
    searchdirection: ""
  }
  constructor() {
    //Apis server desarrollo
    var newserverURL = 'http://13.59.31.150/summit/api/';
    var ticketsURL = 'http://13.59.31.150/ticketsHospital/api/';
    var covidURL = 'http://13.59.31.150/CovidHospital/api/';
    var summitHospitalServer = 'http://13.58.166.253/summitPrueba/';

    //Apis server QA
    //var newserverURL = 'http://3.23.88.169/summit/api/';
    //var ticketsURL = 'http://3.23.88.169/ticketsHospital/api/';
    //var covidURL = 'http://3.23.88.169/covidApis/api/';

    //Apis server demo
    //var newserverURL = 'http://18.224.108.194/summit/api/';
    //var ticketsURL = 'http://18.224.108.194/ticketsHospital/api/';
    //var covidURL = 'http://18.224.108.194/covidApis/api/';

    this.params.serverurl = newserverURL;
    this.params.registerurl = newserverURL + "register";
    this.params.loginurl = newserverURL + "users/login";
    this.params.userurl = newserverURL + "users";
    this.params.beaconurl = newserverURL + "beacons";
    this.params.gatewayurl = newserverURL + "gateways";
    this.params.asseturl = newserverURL + "assets";
    this.params.mapurl = newserverURL + "maps";
    this.params.pointsurl = newserverURL + "points";
    this.params.uploadurl = newserverURL + "upload";
    this.params.fileurl = newserverURL + "files";
    this.params.typesurl = newserverURL + "types";
    this.params.schedulesurl = newserverURL + "schedules";
    this.params.staffurl = newserverURL + "people";
    this.params.counter = newserverURL + "counter";
    this.params.tbeacon = newserverURL + "tbeacon";
    this.params.alerturl = newserverURL + "alert";
    this.params.trackerurl = newserverURL + "tracker";
    this.params.delayurl = newserverURL + "delay";
    this.params.operationurl = newserverURL + "operation";
    this.params.charturl = newserverURL + "char1";
    this.params.assetsalerturl = newserverURL + "assetalert";
    this.params.assetshistoryurl = newserverURL + "assetshistory";
    this.params.pacienthistoryurl = newserverURL + "pacientshistory";
    this.params.pointinfourl = newserverURL + "pointinfo";
    this.params.pointgeneralurl = newserverURL + "pointgeneral";
    this.params.pointgeneralurlpacients = newserverURL + "pointgeneralpacient";
    this.params.pacientspecificurl = newserverURL + "/points/summary/people";
    this.params.pointspecificurl = newserverURL + "pointinfo";
    this.params.charalertsviewsurl = newserverURL + "charalertsviews";
    this.params.charassetspointsurl = newserverURL + "charassetspoints";
    this.params.charspecificpointsurl = newserverURL + "charspecificpoints";
    this.params.trackerhistory = newserverURL + "trackerhistory";
    this.params.category = newserverURL + "categories";
    this.params.subcategory = newserverURL + "subcatergories";
    this.params.type = newserverURL + "types";
    this.params.status = newserverURL + "status";
    this.params.permissions = newserverURL + "permissions";
    this.params.roles = newserverURL + "roles";
    this.params.priority = newserverURL + "priorities";
    this.params.personalert = newserverURL + "person_alert";
    this.params.assetalert = newserverURL + "asset_alert";
    this.params.heartrate = newserverURL + "heartratehistories";
    this.params.gatewaybeacons = newserverURL + "gatewaybeacons";
    var mapwizeurl = "https://api.mapwize.io/v1/";
    var apikey = "?api_key=439578d65ac560a55bb586feaa299bf7";
    this.mapwizeParams.searchdirection = mapwizeurl + "directions" + apikey;

    this.params.ticketCreate = ticketsURL + "orchestra_createTicket";
    this.params.ticketServices = ticketsURL + "orchestra_services";
    this.params.ticketStatus = ticketsURL + "orchestra_ticketStatus";

    this.params.symptoms = covidURL + "symptoms";
    this.params.anotherCases = covidURL + "anotherCases";
    this.params.diagnosticSymptoms = covidURL + "diagnosticSymptoms";
    this.params.diagnosticCases = covidURL + "diagnosticCases";
    this.params.diagnostics = covidURL + "diagnostics";
    this.params.noRegisteredDiagSymtoms = covidURL + "noRegisteredDiagSymtoms";
    this.params.noRegisteredDiagCases = covidURL + "noRegisteredDiagCases";
    this.params.noRegisteredDiagnostics = covidURL + "noRegisteredDiagnostics";

    this.params.registroPacient = covidURL + "registerPacients";
    this.params.pacient_poll = covidURL + "pacient_poll";
    this.params.prenatalCare_poll= covidURL + "prenatalCare_poll";
    this.params.topicsInformations = covidURL + "topicsInformations";
    this.params.chronicDiseases = covidURL + "chronicDiseases";
    this.params.currentDiseases = covidURL + "currentDiseases";
    this.params.complications = covidURL + "complications";
    this.params.topicsInformation_pacient=covidURL+"topicsInformation_pacient";
    this.params.chronicDiseases_pacient=covidURL+"chronicDiseases_pacient";
    this.params.currentDiseases_pacient=covidURL+"currentDiseases_pacient";
    this.params.complications_pacient=covidURL+"complications_pacient";

    this.params.searchById = summitHospitalServer + "api/searchPeopleById/id/"
    this.params.addOrEditPeople = summitHospitalServer + "api/EditOrAddPeople"
  }//fin de bob



}//fin de class439578d65ac560a55bb586feaa299bf7
