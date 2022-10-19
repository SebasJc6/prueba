import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { filterRequestTrayI, getRequestTrayI } from 'src/app/Models/ModelsPAA/request-tray/request-tray';


@Injectable({
  providedIn: 'root'
})
export class RequestTrayService {
  readonly Url: string= environment.baseUrl.logic;
  
  constructor(private http: HttpClient) { }
  
  token = sessionStorage.getItem('token');

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.token,
  });

  getRequestTray(formPage: filterRequestTrayI): Observable<getRequestTrayI> {
    let dir = `${this.Url}BandejaModificacion?NumeroSolicitud=${formPage.NumeroSolicitud}&Vigencia=
    ${formPage.Vigencia}&FechaPresentacion=${formPage.FechaPresentacion}&CodigoProyecto=${formPage.CodigoProyecto}&NombreProyecto=${formPage.NombreProyecto}&Version=${formPage.Version}&Solicitante=${formPage.Solicitante}&Estado=${formPage.Estado}&FechaAprobacion_rechazo=${formPage.FechaAprobacion_rechazo}&page=${formPage.page}&take=${formPage.take}&columna=${formPage.columna}&ascending=${formPage.ascending}`;    

    console.log(this.token);
    
    return this.http.get<getRequestTrayI>(dir,{ headers: this.headers });
  }

}
