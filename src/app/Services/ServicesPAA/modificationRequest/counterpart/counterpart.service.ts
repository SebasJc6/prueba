import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterpartInterface, getCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CounterpartService {

  readonly Url: string= environment.baseUrl.logic ;
  readonly Url2: string= environment.baseUrl.generic ;

  constructor(private http: HttpClient) { }

  token = sessionStorage.getItem('token');

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.token,
  });

  getCounterpartFRequest(id_request: string): Observable<getCounterpartI>{
    let dir = `${this.Url}Solicitud/${id_request}/Fuentes`;
    return this.http.get<getCounterpartI>(dir,{ headers: this.headers });
  }

  postFuentesGetList(listSources: string[]): Observable<any>{
    let dir = `${this.Url2}Fuente/GetListOf`;
    return this.http.post(dir,listSources,{ headers: this.headers });
  }
}
