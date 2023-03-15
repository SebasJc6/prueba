import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filterProjectI, getAllProjectReportsI, getProjectByIdI, getProjectI, postProjectValidityI, statusI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  readonly url: string = environment.baseUrl.logic + 'PlanAnual';

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<getProjectI> {
    let dir = this.url;
    return this.http.get<getProjectI>(dir);
  }

  getAllProjectsFilter(formFilter: filterProjectI): Observable<getProjectI> {
    let dir = this.url +
      '?DependenciaOrigen=' + formFilter.DependenciaOrigen +
      '&CodigoProyecto=' + formFilter.CodigoProyecto +
      '&Nombre=' + formFilter.Nombre +
      '&EstadoDesc=' + formFilter.EstadoDesc +
      '&page=' + formFilter.page +
      '&take=' + formFilter.take +
      '&columna=' + formFilter.columna +
      '&ascending=' + formFilter.ascending;
    return this.http.get<any>(dir);
  }

  getProjectById(projectId: number): Observable<getProjectByIdI> {
    let dir = `${this.url}/${projectId}/Resumen`;
    return this.http.get<getProjectByIdI>(dir);
  }

  patchExecutionProject(projectId: number): Observable<statusI> {
    let dir = this.url + '/Ejecucion/' + projectId;
    return this.http.patch<statusI>(dir, null);
  }

  patchStatusProject(projectId: number): Observable<statusI> {
    let dir = this.url + '/Estado/' + projectId;
    return this.http.patch<statusI>(dir, null);
  }


  //Endpoint con información resumida de los proyectos para reportes
  getProjectsMini(): Observable<getAllProjectReportsI> {
    let dir = `${this.url}/ProyectoMini`;
    return this.http.get<getAllProjectReportsI>(dir);
  }

  //Endpoint para obtener los años de las vigencias
  postProjectValidity(list_validitys:number[]): Observable<postProjectValidityI> {
    let dir = `${this.url}/Vigencias`;
    return this.http.post<postProjectValidityI> (dir, list_validitys);
  }
}
