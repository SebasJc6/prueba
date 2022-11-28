import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getRPsI, postRPsI } from 'src/app/Models/ModelsPAA/Requeriment/RP/RP.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RpService {
  
  url: string = environment.baseUrl.logic + 'CDPs/';

  constructor(private http: HttpClient) { }

  getRPs(idReq:number, idCDP:number):Observable<getRPsI>{
    let dir = `${this.url}${idReq}/${idCDP}/RP`;
    return this.http.get<getRPsI>(dir);
  }
  postRPs(idCDP:number,formRPs :postRPsI):Observable<any>{
    let dir = `${this.url}${idCDP}/RP`;
    return this.http.post<any>(dir, formRPs);
  }
}
