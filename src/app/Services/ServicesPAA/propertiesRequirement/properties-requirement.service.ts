import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, skipWhile, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { getAllActivitiesI, getAllAuxiliarI, getAllContacTypeI, getAllContractualActionI, getAllDependenciesI, getAllFuentesI, getAllMGAI, getAllPOSPREI, getAllProfileI, getAllReviewsAreaI, getAllSelectionModeDataI, getAllSelectionModeI, getAllUNSPSCI, getConceptsI, getDataAprobadaI, getDataTemporalI, getInfoToCreateReqI, responseVerifyDataSaveI, saveDataEditI, verifyDataSaveI, verifyReqI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesRequirementService {

  logicUrl: string = environment.baseUrl.logic;
  genericUrl: string = environment.baseUrl.generic;

  token = sessionStorage.getItem('token');

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.token,
  });
  constructor(private http: HttpClient) { }

  getInfoToCreateReq(projectId: number): Observable<getInfoToCreateReqI> {
    let dir = this.logicUrl + 'proyecto/' + projectId + '/GetInfoToCreateReq'
    return this.http.get<getInfoToCreateReqI>(dir,{ headers: this.headers });
  }

  getAllDependencies(): Observable<getAllDependenciesI> {
    let dir = this.genericUrl + 'Dependencia'
    return this.http.get<getAllDependenciesI>(dir,{ headers: this.headers });
  }

  getDependenceElastic(value: string): Observable<getAllDependenciesI> {
    let dir = this.genericUrl + 'Dependencia/Elastic?cod=' + value
    return this.http.get<getAllDependenciesI>(dir,{ headers: this.headers });
  }

  getAllSelectionMode(): Observable<getAllSelectionModeI> {
    let dir = this.genericUrl + 'ModalidadDeSeleccion'
    return this.http.get<getAllSelectionModeI>(dir,{ headers: this.headers });
  }

  getSelectionModeElastic(value: string): Observable<getAllSelectionModeI> {
    let dir = this.genericUrl + 'ModalidadDeSeleccion/Elastic?cod=' + value
    return this.http.get<getAllSelectionModeI>(dir,{ headers: this.headers });
  }
  getAllContractualAction(): Observable<getAllContractualActionI> {
    let dir = this.genericUrl + 'Actuacion'
    return this.http.get<getAllContractualActionI>(dir,{ headers: this.headers });
  }

  getAllContacType(): Observable<getAllContacTypeI> {
    let dir = this.genericUrl + 'TipoContrato'
    return this.http.get<getAllContacTypeI>(dir,{ headers: this.headers })
  }

  getAllProfile(): Observable<getAllProfileI> {
    let dir = this.genericUrl + 'Perfil'
    return this.http.get<getAllProfileI>(dir,{ headers: this.headers })
  }

  getAuxiliarElastic(value: string): Observable<getAllAuxiliarI> {
    let dir = this.genericUrl + 'Auxiliar/Elastic?cod=' + value
    return this.http.get<getAllAuxiliarI>(dir,{ headers: this.headers })
  }

  getAuxiliarByProject(projectId: number): Observable<getAllAuxiliarI> {
    let dir = this.logicUrl + 'Proyecto/' + projectId + '/Auxiliares'
    return this.http.get<getAllAuxiliarI>(dir,{ headers: this.headers })
  }

  getFuentesElastic(value: string): Observable<getAllFuentesI> {
    let dir = this.genericUrl + 'Fuente/Elastic?cod=' + value
    return this.http.get<getAllFuentesI>(dir,{ headers: this.headers })
  }

  getFuentesByProject(projectId: number): Observable<getAllFuentesI> {
    let dir = this.logicUrl + 'Proyecto/' + projectId + '/FuentesComplete'
    return this.http.get<getAllFuentesI>(dir,{ headers: this.headers })
  }

  getAllActivities(projectId: number): Observable<getAllActivitiesI> {
    let dir = this.logicUrl + 'proyecto/' + projectId + '/Actividades'
    return this.http.get<getAllActivitiesI>(dir,{ headers: this.headers })
  }

  getMGAElastic(value: string): Observable<getAllMGAI> {
    let dir = this.genericUrl + 'MGA/Elastic?cod=' + value
    return this.http.get<getAllMGAI>(dir,{ headers: this.headers })
  }

  getPOSPREElastic(value: string): Observable<getAllPOSPREI> {
    let dir = this.genericUrl + 'POSPRE/Elastic?cod=' + value
    return this.http.get<getAllPOSPREI>(dir,{ headers: this.headers })
  }

  getUNSPSCElastic(value: string): Observable<getAllUNSPSCI> {
    let dir = this.genericUrl + 'UNSPSC/Elastic?cod=' + value
    return this.http.get<getAllUNSPSCI>(dir,{ headers: this.headers })
  }

  getAllReviewsArea(): Observable<getAllReviewsAreaI> {
    let dir = this.logicUrl + 'AreaRevision'
    return this.http.get<getAllReviewsAreaI>(dir,{ headers: this.headers })
  }

  getAllConcepts(): Observable<getConceptsI> {
    let dir = this.logicUrl + 'AreaRevision/Conceptos'
    return this.http.get<getConceptsI>(dir,{ headers: this.headers })
  }

  getAllDataTemporal(projectId: number, requestId: number, reqTempId: number): Observable<getDataTemporalI> {
    let dir = this.logicUrl + 'Solicitud/' + requestId + '/Proyecto/' + projectId + '/Temporal/' + reqTempId
    return this.http.get<getDataTemporalI>(dir,{ headers: this.headers })
  }
  getDataAprobad(projectId: number, requerimetId: number): Observable<getDataAprobadaI> {
    let dir = this.logicUrl + '/Proyecto/' + projectId + '/Requerimiento/' + requerimetId
    return this.http.get<getDataAprobadaI>(dir,{ headers: this.headers })
  }

  verifyNumReq(projectId: number, numReq: number): Observable<verifyReqI> {
    let dir = this.logicUrl + 'Requerimiento/Verify/' + numReq + '?ProyectId=' + projectId
    return this.http.get<verifyReqI>(dir,{ headers: this.headers })
  }

  verifyRangeSararial(perfilId: number, value: number): Observable<verifyReqI> {
    let dir = this.genericUrl + 'RangoSalarialPerfil/Validate?perfilId=' + perfilId + '&value=' + value
    return this.http.get<verifyReqI>(dir,{ headers: this.headers })
  }
  postVerifyDataSaveI(form: verifyDataSaveI): Observable<responseVerifyDataSaveI> {
    let dir = this.logicUrl + 'Requerimiento/Verify'
    return this.http.post<responseVerifyDataSaveI>(dir, form,{ headers: this.headers })
  }

  

  putModificationRequestSend(form: saveDataEditI): Observable<any> {
    let dir = `${this.logicUrl}SolicitudMod/Guardar`;
    return this.http.put(dir, form,{ headers: this.headers });
  }
}
