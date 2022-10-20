import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAbstractI } from 'src/app/Models/ModelsPAA/Abstract/abstract';
import { AuthenticationService } from '../../Authentication/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AbstractService {
  readonly Url: string= environment.baseUrl.logic;
  
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAbstract(projectId: string): Observable<getAbstractI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}Proyecto/${projectId}/Resumen`;
    return this.http.get<getAbstractI>(dir,{ headers: headers });
  }
}
