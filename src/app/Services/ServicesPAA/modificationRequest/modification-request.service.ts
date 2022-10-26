import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { filterModificationRequestI, getModificationRequestByRequesI, getModificationRequestI, modificationRequestI, postModificationRequestI, postModificRequestCountersI, RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { getDataI } from 'src/app/Models/ModelsPAA/Requeriment/RequerimentApproved.interface';
import { AuthenticationService } from '../../Authentication/authentication.service';
import { AuthInterceptorService } from '../../Authentication/Interceptor/auth-interceptor.service';
import { ImportBody } from 'src/app/Views/PAA/requirements/modification-request/pop-up-import/pop-up-import.component';

@Injectable({
  providedIn: 'root'
})
export class ModificationRequestService {


  readonly Url: string= environment.baseUrl.logic ;

  constructor(private http: HttpClient, private authService: AuthenticationService, private authInterceptor: AuthInterceptorService) {}

  getModificationRequest(idProject: number): Observable<getModificationRequestI>{
    let dir = this.Url + 'Proyecto/' + idProject + '/SolicitudMod';
    return this.http.get<getModificationRequestI>(dir);
  }

  getModificationRequestByRequest(idProject:number,idRequets: number ): Observable<getModificationRequestI>{
    let dir = this.Url + 'Proyecto/' + idProject + '/SolicitudMod/' + idRequets;
    return this.http.get<getModificationRequestI>(dir);
  }

  getModification(): Observable<getModificationRequestI>{
    return this.http.get<getModificationRequestI>(this.Url);
  }

  getModificationRequestByRequestId(idRequets: number,formFilter: filterModificationRequestI): Observable<getModificationRequestByRequesI>{
    let dir = this.Url  + 'SolicitudMod/' +idRequets + '/Modificaciones' +
    '?NumeroRequerimiento=' + formFilter.NumeroRequerimiento +
    '&DependenciaDestino=' + formFilter.DependenciaDestino +
    '&Descripcion=' + formFilter.Descripcion +
    '&ActuacionContractual=' + formFilter.ActuacionContractual +
    '&NumeroContrato=' + formFilter.NumeroContrato +
    '&TipoContrato=' + formFilter.TipoContrato +
    '&Perfil=' + formFilter.Perfil +
    '&ModalidadSeleccion=' + formFilter.ModalidadSeleccion + 
    '&page=' + formFilter.page +
    '&take=' + formFilter.take +
    '&columna=' + formFilter.columna +
    '&ascending=' + formFilter.ascending;
    return this.http.get<getModificationRequestByRequesI>(dir);
  }

  //Funcionalidad de guardar
  postModificationRequestSave(dataSave: postModificationRequestI): Observable<any> {
    let dir = `${this.Url}SolicitudMod/Guardar`;
    return this.http.post(dir, dataSave);
  }
  putModificationRequestSave(dataSave: postModificationRequestI): Observable<any> {
    let dir = `${this.Url}SolicitudMod/Guardar`;
    return this.http.put(dir, dataSave);
  }

  //Funcionalidad de enviar
  putModificationRequestSend(dataSave: any): Observable<any> {
    let dir = `${this.Url}SolicitudMod/Enviar`;
    return this.http.put(dir, dataSave);
  }
  

  deleteModificationRequest(idRequets: number ): Observable<any>{
    let dir = `${this.Url}SolicitudMod/${idRequets}`;
    return this.http.delete(dir);
  }


  importFile(id_project: number, info: any): Observable<any> {
    let dir = `${this.Url}/SolicitudMod/ImportFile?projectId=${id_project}`;
    console.log(info);
    
    return this.http.post(dir, info);
  }


  exportFile(projectId: string, requestId: string): Observable<any> {
    let dir = `${this.Url}/SolicitudMod/ExportFile?ProyectoId=${projectId}&SolicitudId=${requestId}`;
    return this.http.get(dir, {responseType: 'blob'});
  }

  getRequerimentApproved(idRequest: string, idRequeriment: number): Observable<any> {
    let dir = `${this.Url}/Proyecto/${idRequest}/Requerimiento/${idRequeriment}`;
    return this.http.get<any>(dir);
  }

  putRevisionesEnviar(body: RevisionSend): Observable<any> {
    let dir = `${this.Url}Revisiones/Enviar/Solicitud`;
    return this.http.put(dir, body);
  }
}
