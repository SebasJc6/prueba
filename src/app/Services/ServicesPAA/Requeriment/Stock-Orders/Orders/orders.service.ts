import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getGirosI, postGirosI } from 'src/app/Models/ModelsPAA/Requeriment/StockOrders/Orders/orders.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  url: string = environment.baseUrl.logic + 'Giros';


  constructor(private http: HttpClient) { }

  getGiro(idReq:number,idGiro:number):Observable<getGirosI>{
    let dir = `${this.url}/${idReq}/Giro/${idGiro}`;
    return this.http.get<getGirosI>(dir);
  }

  postGiro(form:postGirosI):Observable<any>{
    let dir = `${this.url}`;
    return this.http.put(dir,form);
  }
}
