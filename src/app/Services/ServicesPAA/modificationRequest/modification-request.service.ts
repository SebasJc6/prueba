import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { filterModificationRequestI, getModificationRequestByRequesI, getModificationRequestI, modificationRequestI, postModificationRequestI, postModificRequestCountersI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { getDataI } from 'src/app/Models/ModelsPAA/Requeriment/RequerimentApproved.interface';
import { AuthenticationService } from '../../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ModificationRequestService {


  readonly Url: string= environment.baseUrl.logic ;

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getModificationRequest(idProject: number): Observable<getModificationRequestI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.Url + 'Proyecto/' + idProject + '/SolicitudMod';
    return this.http.get<getModificationRequestI>(dir,{ headers: headers });
  }

  getModificationRequestByRequest(idProject:number,idRequets: number ): Observable<getModificationRequestI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.Url + 'Proyecto/' + idProject + '/SolicitudMod/' + idRequets;
    return this.http.get<getModificationRequestI>(dir,{ headers: headers });
  }

  getModification(): Observable<getModificationRequestI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    return this.http.get<getModificationRequestI>(this.Url,{ headers: headers });
  }

  getModificationRequestByRequestId(idRequets: number,formFilter: filterModificationRequestI): Observable<getModificationRequestByRequesI>{
    
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.Url  + 'SolicitudMod/' +idRequets + '/Modificaciones/'
    '?page=' + formFilter.page +
    '&take=' + formFilter.take 
    // '&columna=' + formFilter.columna +
    // '&ascending=' + formFilter.ascending+
    // '&NumeroRequerimiento=' + formFilter.NumeroRequerimiento +
    // '&DependenciaDestino=' + formFilter.DependenciaDestino +
    // '&ActuacionContractual=' + formFilter.ActuacionContractual +
    // '&NumeroContrato=' + formFilter.NumeroContrato +
    // '&TipoContrato=' + formFilter.TipoContrato +
    // '&Perfil=' + formFilter.Perfil +
    // '&Honorarios=' + formFilter.Honorarios +
    // '&SaldoRequerimiento=' + formFilter.SaldoRequerimiento +
    // '&ValorAumenta=' + formFilter.ValorAumenta +
    // '&ValorDisminuye=' + formFilter.ValorDisminuye +
    // '&NuevoSaldoApropiacion=' + formFilter.NuevoSaldoApropiacion +
    // '&ModalidadSeleccion=' + formFilter.ModalidadSeleccion ;    
    return this.http.get<getModificationRequestByRequesI>(dir,{ headers: headers });
  }

  //Funcionalidad de guardar
  postModificationRequestSave(dataSave: postModificationRequestI): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}SolicitudMod/Guardar`;
    return this.http.post(dir, dataSave,{ headers: headers });
  }
  putModificationRequestSave(dataSave: postModificationRequestI): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}SolicitudMod/Guardar`;
    return this.http.put(dir, dataSave,{ headers: headers });
  }

  //Funcionalidad de enviar
  putModificationRequestSend(dataSave: any): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}SolicitudMod/Enviar`;
    return this.http.put(dir, dataSave,{ headers: headers });
  }
  

  deleteModificationRequest(idRequets: number ): Observable<any>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}SolicitudMod/${idRequets}`;
    return this.http.delete(dir,{ headers: headers });
  }


  importFile(body: any, file: FormData): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}/SolicitudMod/ImportFile?ProjectId=${body.ProjectId}&Observacion=${body.Observacion}`;
    return this.http.post(dir, file,{ headers: headers });
  }


  exportFile(projectId: string, requestId: string): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}/SolicitudMod/ExportFile?ProyectoId=${projectId}&SolicitudId=${requestId}`;
    return this.http.get(dir, {responseType: 'blob', headers: headers});
  }

  getRequerimentApproved(idRequest: string, idRequeriment: number): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.Url}/Proyecto/${idRequest}/Requerimiento/${idRequeriment}`;
    return this.http.get<any>(dir,{ headers: headers });
  }
}
