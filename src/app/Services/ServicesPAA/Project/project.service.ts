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

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAllProjects(): Observable<getProjectI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.url;
    return this.http.get<getProjectI>(dir,{ headers: headers });
  }
  getAllProjectsFilter(formFilter: filterProjectI): Observable<getProjectI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.url +
      '?DependenciaOrigen=' + formFilter.DependenciaOrigen +
      '&CodigoProyecto=' + formFilter.CodigoProyecto +
      '&Nombre=' + formFilter.Nombre +
      '&EstadoDesc=' + formFilter.EstadoDesc +
      '&page=' + formFilter.page +
      '&take=' + formFilter.take +
      '&columna=' + formFilter.columna +
      '&ascending=' + formFilter.ascending;
    return this.http.get<any>(dir, { headers: headers });
  }
  getProjectById(projectId: number): Observable<getProjectByIdI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.url + '/' + projectId;
    return this.http.get<getProjectByIdI>(dir,{ headers: headers });
  }

  patchExecutionProject(projectId: number): Observable<statusI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.url + '/Ejecucion/' + projectId;
    return this.http.patch<statusI>(dir,{ headers: headers });
  }

  patchStatusProject(projectId: number): Observable<statusI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.url + '/Estado/' + projectId;
    return this.http.patch<statusI>(dir,{ headers: headers });
  }
}
