import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CounterpartService {

  readonly Url: string= environment.baseUrl.logic ;

  constructor(private http: HttpClient) { }

  getCounterpartFRequest(idProject: string): Observable<getCounterpartI>{
    let dir = `${this.Url}Proyecto/${idProject}/FuentesComplete`;
    return this.http.get<getCounterpartI>(dir);
  }
}
