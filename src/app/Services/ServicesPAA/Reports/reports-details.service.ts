import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iDsAndAniosProjectsReportPAAI, iDsProjectsReportI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { getReportBase64I, getReportsAllI, getReportsNameI } from 'src/app/Models/ModelsPAA/Reports/reports-interface';
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

  postReportPAA(project_ids: iDsProjectsReportI): Observable<getReportBase64I>{
    let dir = `${this.Url}Reporte/PAA`;
    return this.http.post<getReportBase64I>(dir, project_ids);
  }


  postReportREP(report_info : iDsAndAniosProjectsReportPAAI): Observable<getReportBase64I>{
    let dir = `${this.Url}Reporte/ResumenEjecucionPresupuestal`;
    return this.http.post<getReportBase64I>(dir, report_info);
  }

  //Servicio que obtiene un reporte de modificaciones
  postReportModifications(project_ids : iDsProjectsReportI ): Observable<getReportBase64I> {
    let dir = `${this.Url}Reporte/Modificaciones`;
    return this.http.post<getReportBase64I>(dir, project_ids);
  }
  
  //Servicio que obtiene un reporte de CDPs
  postReportCDPs(project_ids : iDsProjectsReportI ): Observable<getReportBase64I> {
    let dir = `${this.Url}Reporte/CDPs`;
    return this.http.post<getReportBase64I>(dir, project_ids);
  }
}
