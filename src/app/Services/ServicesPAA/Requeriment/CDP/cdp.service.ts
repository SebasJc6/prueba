import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { dataCDPsI, filterCDPsI } from 'src/app/Models/ModelsPAA/Requeriment/cdp';

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


  putLockCDPs(id_requeriment: number): Observable<any> {
    let dir = ``;
    return this.http.put(dir, null);
  }
}
