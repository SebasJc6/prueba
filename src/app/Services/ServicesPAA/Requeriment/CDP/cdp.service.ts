import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { dataCDPsI, filterCDPsI, putLockCDPsI } from 'src/app/Models/ModelsPAA/Requeriment/cdp';

@Injectable({
  providedIn: 'root'
})
export class CDPService {

  url: string = environment.baseUrl.logic + 'CDPs/';

  constructor(private http: HttpClient) { }

  getCDPsByRequerimentId(id_requeriment: number, filterForm: filterCDPsI): Observable<dataCDPsI> {
    let dir = `${this.url}${id_requeriment}/CDP?Vigencia=${filterForm.Vigencia}
    &CDP=${filterForm.CDP}&Fecha_CDP=${filterForm.Fecha_CDP}&page=${filterForm.page}
    &take=${filterForm.take}&columna=${filterForm.columna}&ascending=${filterForm.ascending}`;
    return this.http.get<dataCDPsI>(dir);
  }


  putLockCDPs(id_requeriment: number): Observable<putLockCDPsI> {
    let dir = `${this.url}${id_requeriment}/Lock`;
    return this.http.put<putLockCDPsI>(dir, null);
  }

  putEnableCDPs(id_requeriment: number, body: number[]): Observable<any> {
    let dir = `${this.url}${id_requeriment}/Enable`;
    return this.http.put(dir, body);
  }

  postCDPs(file : any): Observable<any> {
    let dir = `${this.url}`;
    return this.http.post(dir, file);
  }


  patchCDPs(file : any): Observable<any> {
    let dir = `${this.url}`;
    return this.http.patch(dir, file);
  }
}
