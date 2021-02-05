import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  colors = ["lightgrey","lightseagreen","lightcoral","lightpink","lightblue","lightsalmon"]

  icons = {
    "Emergencias": {
      class: "fas fa-ambulance",
      font: "x-large",
      color: "lightcoral",
    },
    "Farmacia": {
      class: "fas fa-pills",
      font: "x-large",
      color: "lightseagreen",
    },
    "Obstetrícia": {
      class: "fas fa-baby",
      font: "x-large",
      color: "lightsalmon",
    },
    "Psicología": {
      class: "fas fa-head-side-virus",
      font: "x-large",
      color: "lightblue",
    },
    "Patología": {
      class: "fas fa-biohazard",
      font: "x-large",
      color: "lightgrey",
    },
    "Consulta Externa": {
      class: "fas fa-user-md",
      font: "x-large",
      color: "lightsalmon",
    },
    "Primary Care": {
      class: "fas fa-briefcase-medical",
      font: "x-large",
      color: "lightpink",
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

  randomColor(){
    let colorNumber = Math.floor(Math.random()*(7-1))+1;
    if(colorNumber <= this.colors.length){
      return this.colors[colorNumber];
    }
    this.randomColor();
  }

}