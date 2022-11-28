import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAbstractDataYear, getAbstractI } from 'src/app/Models/ModelsPAA/Abstract/abstract';


@Injectable({
  providedIn: 'root'
})
export class AbstractService {
  readonly Url: string= environment.baseUrl.logic;
  
  constructor(private http: HttpClient) { }

  getAbstract(projectId: string): Observable<getAbstractI> {
    let dir = `${this.Url}Proyecto/${projectId}/Resumen`;
    return this.http.get<getAbstractI>(dir);
  }

  getAbstractYear(project_id: number, year: number): Observable<getAbstractDataYear> {
    let dir = `${this.Url}Proyecto/${project_id}/ResumenInfo/${year}`;
    return this.http.get<getAbstractDataYear>(dir);
  }
}
