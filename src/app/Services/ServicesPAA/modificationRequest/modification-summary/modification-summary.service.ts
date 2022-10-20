import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getModificationSummaryI, pageModificationSummaryI } from 'src/app/Models/ModelsPAA/modificatioRequest/modification-summary/modification-summary';
import { getSourcesI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModificationSummaryService {
  readonly Url: string= environment.baseUrl.logic;
  
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getSourcesRequest(id_request: string): Observable<getSourcesI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}Solicitud/${id_request}/Fuentes`;
    return this.http.get<getSourcesI>(dir,{ headers: headers });
  }

  getSummary(solModId: number, fuenteId: number, formPage: pageModificationSummaryI): Observable<getModificationSummaryI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}SolicitudMod/${solModId}/Resumen/${fuenteId}?page=${formPage.page}&take=${formPage.take}`;    
    return this.http.get<getModificationSummaryI>(dir,{ headers: headers });
  }
}