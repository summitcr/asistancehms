import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private urlApi = "https://ubicaciones.paginasweb.cr/provincia";
  private cantones: any;
  private distritos: any;

  constructor( private http:HttpClient ) { }

  /**
   * getProvincia
   */
  public getProvincias() {
    return this.http.get(`${this.urlApi}s.json`);
  }

  /**
   * getCantones
   */
  public getCantones(provinciaId) {
    return this.http.get(`${this.urlApi}/${provinciaId}/cantones.json`).toPromise();
  }

  /**
   * getDistritos
   */
  public getDistritos(provinciaId, cantonId) {
    return this.http.get(`${this.urlApi}/${provinciaId}/canton/${cantonId}/distritos.json`).toPromise();
  }
}
