import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  colors = ["lightgrey", "lightseagreen", "lightcoral", "lightpink", "lightblue", "lightsalmon"]

  icons = {
    "Consulta Social - Con Cita": {
      class: "fas fa-ambulance",
      font: "x-large",
      color: "lightcoral",
      placeId: "5e4efba61fa49c0016f0cf5e",
      lat: 9.975371438146254,
      long: -84.74963721723189
    },
    "Consulta Social - Sin Cita": {
      class: "fas fa-pills",
      font: "x-large",
      color: "lightseagreen",
      placeId: "5e4ef9728635740016440477",
      lat: 9.975338565945762 ,
      long: -84.7495056826686
    },
    "T.S - Atención Social": {
      class: "fas fa-baby",
      font: "x-large",
      color: "lightsalmon",
      placeId: "5e4efbeb0d943d00163d3c68",
      lat: 9.97524757864808,
      long: -84.74967511482737
    },
    "T.S - Referencias": {
      class: "fas fa-head-side-virus",
      font: "x-large",
      color: "lightblue",
      placeId: "5e4ef9b6bdadf00016d02b1f",
      lat: 9.975077890814049 ,
      long: -84.74972648988147
    },
    "Emergencias - Clasificacion": {
      class: "fas fa-biohazard",
      font: "x-large",
      color: "lightgrey",
      placeId: "5e4efb4d411a5a0016ab4d5e",
      lat: 9.975371438146254 ,
      long: -84.74963721723189
    },
    "Emergencias - Clasificacion Preferencial": {
      class: "fas fa-user-md",
      font: "x-large",
      color: "lightsalmon",
      placeId: "5e4efadd9f725b0016e838b7",
      lat: 9.975042499326563 ,
      long: -84.74959578171676
    },
    "B.S - Contratación": {
      class: "fas fa-briefcase-medical",
      font: "x-large",
      color: "lightpink",
      placeId: "5e4efb099f725b0016e838ba",
      lat: 9.974952520052668 ,
      long: -84.74968825731294
    },
  }

  constructor() { }

  setIconsToServices(services) {
    let newServices = [];
    services.forEach(service => {
      Object.keys(this.icons).map(indice => {
        if (service.name === indice) {
          let data = {
            ...service,
            icon: { ...this.icons[indice] }
          }
          console.log(data)
          newServices.push(data);
        }
      })
      console.log(newServices)
    });
    return newServices
  }

  randomColor() {
    let colorNumber = Math.floor(Math.random() * (7 - 1)) + 1;
    if (colorNumber <= this.colors.length) {
      return this.colors[colorNumber];
    }
    this.randomColor();
  }

}