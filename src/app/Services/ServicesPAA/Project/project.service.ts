import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filterProjectI, getProjectByIdI, getProjectI, statusI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  readonly url: string = environment.baseUrl.logic + 'Proyecto';

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
    let dir = this.url + '/' + projectId;
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
}
