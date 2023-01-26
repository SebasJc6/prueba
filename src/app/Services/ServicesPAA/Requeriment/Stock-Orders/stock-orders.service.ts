import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filterStockOrdersI, getStockOrdersI } from 'src/app/Models/ModelsPAA/Requeriment/StockOrders/stock-orders-interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockOrdersService {

  url: string = environment.baseUrl.logic + 'Giros/';

  constructor(private http: HttpClient) { }

  getStockOrdersByRequeriments(id_requeriment: number, filterForm: filterStockOrdersI): Observable<getStockOrdersI> {
    let dir = `${this.url}${id_requeriment}?Vigencia=${filterForm.Vigencia}&NumeroOrden=${filterForm.NumeroOrden}
    &FechaGiro=${filterForm.FechaGiro}&RP=${filterForm.RP}&page=${filterForm.page}
    &take=${filterForm.take}&columna=${filterForm.columna}&ascending=${filterForm.ascending}`;
    return this.http.get<getStockOrdersI>(dir);
  }

  postStockOrders(file: any): Observable<any> {
    let dir = `${this.url}`;
    return this.http.post(dir, file);
  }

  patchLockStockOrders(id_requeriment: number): Observable<any> {
    let dir = `${this.url}${id_requeriment}/Lock`;
    return this.http.patch<any>(dir, null);
  }

  patchEnableOrders(id_requeriment: number, body: any[]): Observable<any> {
    let dir = `${this.url}${id_requeriment}/Enable`;
    return this.http.patch(dir, body);
  }
}
