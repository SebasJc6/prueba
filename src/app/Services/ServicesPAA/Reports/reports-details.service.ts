import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getReportsAllI, getReportsNameI } from 'src/app/Models/ModelsPAA/Reports/reports-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsDetailsService {

  readonly Url: string= environment.baseUrl.logic;

  constructor( private http: HttpClient ) { }

  getReportsAll(): Observable<getReportsAllI> {
    let dir = `${this.Url}Reporte/All`;
    return this.http.get<getReportsAllI>(dir);
  }


  getReportsName(): Observable<getReportsNameI> {
    let dir = `${this.Url}Reporte/Names`;
    return this.http.get<getReportsNameI>(dir);
  }
}
