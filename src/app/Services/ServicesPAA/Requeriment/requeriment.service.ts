import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getRequerimentsByProjectI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { filterDataRequerimentI, filterRequerimentI, getDataRequerimentI } from 'src/app/Models/ModelsPAA/Requeriment/Requeriment.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequerimentService {
  url: string = environment.baseUrl + 'Proyecto/';

  constructor(private http: HttpClient) { }



  // getRequerimentsByProject(projectId: number): Observable<getRequerimentsByProjectI> {
  //   let dir = this.url + projectId + '/Requerimientos';
  //   return this.http.get<getRequerimentsByProjectI>(dir);
  // }

  getRequerimentsByProject(projectId: number, formFilter: filterRequerimentI): Observable<getRequerimentsByProjectI> {
    let dir = this.url + projectId +
      '/Requerimientos?NumeroRequerimiento=' + formFilter.NumeroRequerimiento +
      '&DependenciaDestino=' + formFilter.DependenciaDestino +
      '&Descripcion=' + formFilter.Descripcion +
      '&Estado=' + formFilter.Estado +
      '&page=' + formFilter.page +
      '&take=' + formFilter.take +
      '&columna=' + formFilter.columna +
      '&ascending=' + formFilter.ascending;

    return this.http.get<getRequerimentsByProjectI>(dir);
  }

  getDataRequeriment(projectId: number, formFilter: filterDataRequerimentI): Observable<getDataRequerimentI> {
    let dir = this.url + projectId +
      '/DataRequerimientos?page=' + formFilter.page +
      '&take=' + formFilter.take +
      '&NumeroRequerimiento=' + formFilter.NumeroRequerimiento +
      '&Descripcion=' + formFilter.Descripcion;
    return this.http.get<getDataRequerimentI>(dir);
  }
}
