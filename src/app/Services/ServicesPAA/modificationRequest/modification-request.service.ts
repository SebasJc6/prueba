import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { filterModificationRequestI, getActuacionI, getModalidadDeSeleccionI, getModificationRequestByRequesI, getModificationRequestI, getPerfilI, getTipoContratoI, getValidityByRequestI, postModificationRequestI, RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class ModificationRequestService {


  readonly Url: string= environment.baseUrl.logic ;
  readonly Url_2: string = environment.baseUrl.generic;

  constructor(private http: HttpClient) {}

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

  getModificationRequestByRequestId(idRequets: number, vigencia: number, formFilter: filterModificationRequestI): Observable<getModificationRequestByRequesI>{
    let dir = this.Url  + 'SolicitudMod/' +idRequets + '/Modificaciones/' + vigencia +
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

  getValidityByRequest(id_request: number): Observable<getValidityByRequestI> {
    let dir = `${this.Url}/SolicitudMod/${id_request}/Vigencias`;
    return this.http.get<getValidityByRequestI>(dir);
  }

  //Obtener el objeto Modalidad de Seleccion (Nombre y Id)
  getModalidadDeSeleccion(id_modalidad: number): Observable<getModalidadDeSeleccionI> {
    let dir = `${this.Url_2}ModalidadDeSeleccion/${id_modalidad}`;
    return this.http.get<getModalidadDeSeleccionI>(dir);
  }

  //Obtener el objeto Actuacion (Nombre y Id)
  getActuacion(id_actuacion: number): Observable<getActuacionI> {
    let dir = `${this.Url_2}Actuacion/${id_actuacion}`;
    return this.http.get<getActuacionI>(dir);
  }

  //Obtener el objeto Perfil (Nombre y Id)
  getPerfil(id_perfil: number): Observable<getPerfilI> {
    let dir = `${this.Url_2}Perfil/${id_perfil}`;
    return this.http.get<getPerfilI>(dir);
  }

  //Obtener el objeto TipoContrato (Nombre y Id)
  getTipoContrato(id_tipoContrato: number): Observable<getTipoContratoI> {
    let dir = `${this.Url_2}TipoContrato/${id_tipoContrato}`;
    return this.http.get<getTipoContratoI>(dir);
  }
}