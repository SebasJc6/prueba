import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filterTaskTrayI, getTaskTrayI } from 'src/app/Models/ModelsPAA/task-tray/task-tray';



@Injectable({
  providedIn: 'root'
})
export class TaskTrayService {
  readonly Url: string= environment.baseUrl.logic;
  token = sessionStorage.getItem('token');

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.token,
  });
  constructor(private http: HttpClient) { }

  getTaskTray(formPage: filterTaskTrayI): Observable<getTaskTrayI> {
    let dir = `${this.Url}BandejaTareas?Fecha=${formPage.Fecha}&CodigoProyecto=
    ${formPage.CodigoProyecto}&NumeroRequerimiento=${formPage.NumeroRequerimiento}&CantidadAjustes=
    ${formPage.CantidadAjustes}&page=${formPage.page}&take=${formPage.take}&columna=
    ${formPage.columna}&ascending=${formPage.ascending}`;
    return this.http.get<getTaskTrayI>(dir,{ headers: this.headers });
  }
}
