import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterpartInterface, getCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CounterpartService {

  readonly Url: string= environment.baseUrl.logic ;
  readonly Url2: string= environment.baseUrl.generic ;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getCounterpartFRequest(id_request: string): Observable<getCounterpartI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}Solicitud/${id_request}/Fuentes`;
    return this.http.get<getCounterpartI>(dir,{ headers: headers });
  }

  postFuentesGetList(listSources: string[]): Observable<any>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url2}Fuente/GetListOf`;
    return this.http.post(dir,listSources,{ headers: headers });
  }
}
