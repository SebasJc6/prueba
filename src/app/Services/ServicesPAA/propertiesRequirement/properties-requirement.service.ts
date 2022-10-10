import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, skipWhile, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { getAllActivitiesI, getAllAuxiliarI, getAllContacTypeI, getAllContractualActionI, getAllDependenciesI, getAllFuentesI, getAllMGAI, getAllPOSPREI, getAllProfileI, getAllReviewsAreaI, getAllSelectionModeDataI, getAllSelectionModeI, getAllUNSPSCI, getConceptsI, getDataTemporalI, getInfoToCreateReqI, responseVerifyDataSaveI, verifyDataSaveI, verifyNumReqI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesRequirementService {

  logicUrl: string = environment.baseUrl.logic;
  genericUrl: string = environment.baseUrl.generic;


  constructor(private http: HttpClient) { }

  getInfoToCreateReq(projectId: number): Observable<getInfoToCreateReqI> {
    let dir = this.logicUrl + 'proyecto/' + projectId + '/GetInfoToCreateReq'
    return this.http.get<getInfoToCreateReqI>(dir);
  }

  getAllDependencies(): Observable<getAllDependenciesI> {
    let dir = this.genericUrl + 'Dependencia'
    return this.http.get<getAllDependenciesI>(dir);
  }

  getDependenceElastic(value: string): Observable<getAllDependenciesI> {
    let dir = this.genericUrl + 'Dependencia/Elastic?cod=' + value
    return this.http.get<getAllDependenciesI>(dir);
  }

  getAllSelectionMode(): Observable<getAllSelectionModeI> {
    let dir = this.genericUrl + 'ModalidadDeSeleccion'
    return this.http.get<getAllSelectionModeI>(dir);
  }

  getSelectionModeElastic(value: string): Observable<getAllSelectionModeI> {
    let dir = this.genericUrl + 'ModalidadDeSeleccion/Elastic?cod=' + value
    return this.http.get<getAllSelectionModeI>(dir);
  }
  getAllContractualAction(): Observable<getAllContractualActionI> {
    let dir = this.genericUrl + 'Actuacion'
    return this.http.get<getAllContractualActionI>(dir);
  }

  getAllContacType(): Observable<getAllContacTypeI> {
    let dir = this.genericUrl + 'TipoContrato'
    return this.http.get<getAllContacTypeI>(dir)
  }

  getAllProfile(): Observable<getAllProfileI> {
    let dir = this.genericUrl + 'Perfil'
    return this.http.get<getAllProfileI>(dir)
  }

  getAuxiliarElastic(value: string): Observable<getAllAuxiliarI> {
    let dir = this.genericUrl + 'Auxiliar/Elastic?cod=' + value
    return this.http.get<getAllAuxiliarI>(dir)
  }

  getAuxiliarByProject(projectId: number): Observable<getAllAuxiliarI> {
    let dir = this.logicUrl + 'Proyecto/' + projectId +'/Auxiliares'
    return this.http.get<getAllAuxiliarI>(dir)
  }

  getFuentesElastic(value: string): Observable<getAllFuentesI> {
    let dir = this.genericUrl + 'Fuente/Elastic?cod=' + value
    return this.http.get<getAllFuentesI>(dir)
  }

  getFuentesByProject(projectId: number): Observable<getAllFuentesI> {
    let dir = this.logicUrl + 'Proyecto/' + projectId +'/FuentesComplete'
    return this.http.get<getAllFuentesI>(dir)
  }

  getAllActivities(projectId: number): Observable<getAllActivitiesI> {
    let dir = this.logicUrl + 'proyecto/' + projectId + '/Actividades'
    return this.http.get<getAllActivitiesI>(dir)
  }

  getMGAElastic(value: string): Observable<getAllMGAI> {
    let dir = this.genericUrl + 'MGA/Elastic?cod=' + value
    return this.http.get<getAllMGAI>(dir)
  }

  getPOSPREElastic(value: string): Observable<getAllPOSPREI> {
    let dir = this.genericUrl + 'POSPRE/Elastic?cod=' + value
    return this.http.get<getAllPOSPREI>(dir)
  }

  getUNSPSCElastic(value: string): Observable<getAllUNSPSCI> {
    let dir = this.genericUrl + 'UNSPSC/Elastic?cod=' + value
    return this.http.get<getAllUNSPSCI>(dir)
  }

  getAllReviewsArea(): Observable<getAllReviewsAreaI> {
    let dir = this.logicUrl + 'AreaRevision'
    return this.http.get<getAllReviewsAreaI>(dir)
  }

  getAllConcepts(): Observable<getConceptsI> {
    let dir = this.logicUrl + 'AreaRevision/Conceptos'
    return this.http.get<getConceptsI>(dir)
  }

  getAllDataTemporal(projectId: number, requestId: number, reqTempId: number): Observable<getDataTemporalI> {
    let dir = this.logicUrl + 'Solicitud/' + requestId + '/Proyecto/' + projectId + '/Temporal/' + reqTempId
    return this.http.get<getDataTemporalI>(dir)
  }

  verifyNumReq(projectId: number, numReq: number): Observable<verifyNumReqI> {
    let dir = this.logicUrl + 'Requerimiento/Verify/' + numReq + '?ProyectId=' + projectId
    return this.http.get<verifyNumReqI>(dir)
  }
  postVerifyDataSaveI(form : verifyDataSaveI): Observable<responseVerifyDataSaveI> {  
    let dir = this.logicUrl + 'Requerimiento/Verify'
    return this.http.post<responseVerifyDataSaveI>(dir, form)
  }
}
