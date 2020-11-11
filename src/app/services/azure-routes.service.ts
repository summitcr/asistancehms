import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

enum traffic {
  true = '&traffic=true',
  false = '&traffic=false'
}

enum travelMode {
  car = '&travelMode=car'
}

enum computeBestOrder {
  true = '&computeBestOrder=true',
  false = '&computeBestOrder=false'
}

enum instructionsType {
  coded = '&instructionsType=coded',
  tagged = '&instructionsType=tagged',
  text = '&instructionsType=text'
}

enum token {
  prod = 'Basic SE5TVkNGSUNPVElDS0VUOlQxY2tldEYxYzAk',
  dev = 'Basic SE5TVkNERVNURUs6VDNrTDBHMm8ybw=='
}

interface OptionsParamsQuery {
  subscriptionKey: string;
  traffic?: true | false;
  travelMode?: 'car';
  computeBestOrder?: true | false;
  routeDirectionsResult?: 'guidance';
  instructionsType?: 'coded' | 'text' | 'tagged';
  routeRepresentation?: 'polyline';
}

@Injectable({
  providedIn: 'root'
})
export class AzureRoutesService {

  private headers = new HttpHeaders({
    'Authorization': token.dev
  });

  private microsoftKey = 'D7u4dtG3OyO-S5wTY5ucRriJqXAmfO8uO20X2Kk3wl0';

  private azureAPI = 'https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=';

  constructor(private utils: UtilsService, private http: HttpClient,) { }

  getRoute(routeQuery) {
    const optionsParams = this.convertParamsToQuery({
      subscriptionKey: this.microsoftKey,
      instructionsType: 'text',
      travelMode: 'car',
      traffic: true,
      computeBestOrder: true,
    });
    return this.http.get(this.azureAPI + routeQuery + optionsParams);
  }

  convertParamsToQuery(options: OptionsParamsQuery): string {
    let query = '';
    query += `&subscription-key=${options.subscriptionKey}`;
    Object.keys(options).map((value) => {
      if (value !== 'subscriptionKey') {
        query += `&${value}=${options[value]}`;
      }
    });
    return query;
  }

}
