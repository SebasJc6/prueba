import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, skipWhile, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { getAllActivitiesI, getAllAnioI, getAllAuxiliarI, getAllContacTypeI, getAllContractualActionI, getAllDependenciesI, getAllFuentesI, getAllMGAI, getAllPOSPREI, getAllProfileI, getAllReviewsAreaI, getAllSelectionModeDataI, getAllSelectionModeI, getAllUNSPSCI, getConceptsI, getDataAprobadaI, getDataTemporalI, getDataTemporalModifiedI, getInfoToCreateReqI, responseVerifyDataSaveI, saveDataEditI, verifyDataSaveI, verifyReqI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../Authentication/authentication.service';
import { skipApiKey } from '../../Authentication/Interceptor/spinner-interceptor.service';

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
    return this.http.get<getAllDependenciesI>(dir, { context: skipApiKey() });
  }

  getDependenceElastic(value: string): Observable<getAllDependenciesI> {
    let dir = this.genericUrl + 'Dependencia/Elastic?cod=' + value
    return this.http.get<getAllDependenciesI>(dir, { context: skipApiKey() });
  }

  getAllSelectionMode(): Observable<getAllSelectionModeI> {
    let dir = this.genericUrl + 'ModalidadDeSeleccion'
    return this.http.get<getAllSelectionModeI>(dir, { context: skipApiKey() });
  }

  getSelectionModeElastic(value: string): Observable<getAllSelectionModeI> {
    let dir = this.genericUrl + 'ModalidadDeSeleccion/Elastic?cod=' + value
    return this.http.get<getAllSelectionModeI>(dir, { context: skipApiKey() });
  }
  getAllContractualAction(): Observable<getAllContractualActionI> {
    let dir = this.genericUrl + 'Actuacion'
    return this.http.get<getAllContractualActionI>(dir, { context: skipApiKey() });
  }
  getAniosBycontrato(numCont: number): Observable<getAllAnioI> {
    let dir = this.genericUrl + 'Contrato/' + numCont + '/Anios'
    return this.http.get<getAllAnioI>(dir, { context: skipApiKey() })
  }

  getAllContacType(): Observable<getAllContacTypeI> {
    let dir = this.genericUrl + 'TipoContrato'
    return this.http.get<getAllContacTypeI>(dir, { context: skipApiKey() })
  }

  getAllProfile(): Observable<getAllProfileI> {
    let dir = this.genericUrl + 'Perfil'
    return this.http.get<getAllProfileI>(dir, { context: skipApiKey() })
  }

  getAuxiliarElastic(value: string): Observable<getAllAuxiliarI> {
    let dir = this.genericUrl + 'Auxiliar/Elastic?cod=' + value
    return this.http.get<getAllAuxiliarI>(dir)
  }

  getAuxiliarByProject(projectId: number): Observable<getAllAuxiliarI> {
    let dir = this.logicUrl + 'Proyecto/' + projectId + '/Auxiliares'
    return this.http.get<getAllAuxiliarI>(dir)
  }

  getFuentesElastic(value: string): Observable<getAllFuentesI> {
    let dir = this.genericUrl + 'Fuente/Elastic?cod=' + value
    return this.http.get<getAllFuentesI>(dir, { context: skipApiKey() })
  }

  getFuentesByProject(projectId: number): Observable<getAllFuentesI> {
    let dir = this.logicUrl + 'Proyecto/' + projectId + '/FuentesComplete'
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
  getMGAById(id: number): Observable<getAllMGAI> {
    let dir = this.genericUrl + 'MGA/' + id
    return this.http.get<getAllMGAI>(dir)
  }
  getPOSPREElastic(value: string): Observable<getAllPOSPREI> {
    let dir = this.genericUrl + 'POSPRE/Elastic?cod=' + value
    return this.http.get<getAllPOSPREI>(dir)
  }
  getPOSPREById(id: number): Observable<getAllPOSPREI> {
    let dir = this.genericUrl + 'POSPRE/' + id
    return this.http.get<getAllPOSPREI>(dir)
  }

  getUNSPSCElastic(value: string): Observable<getAllUNSPSCI> {
    let dir = this.genericUrl + 'UNSPSC/Elastic?cod=' + value
    return this.http.get<getAllUNSPSCI>(dir, { context: skipApiKey() })
  }

  getAllReviewsArea(value: number): Observable<getAllReviewsAreaI> {
    let dir = this.logicUrl + 'AreaRevision/' + value + '/Active'
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
  getDataAprobad(projectId: number, requerimetId: number): Observable<getDataAprobadaI> {
    let dir = this.logicUrl + '/Proyecto/' + projectId + '/Requerimiento/' + requerimetId
    return this.http.get<getDataAprobadaI>(dir)
  }

  verifyNumReq(projectId: number, numReq: number): Observable<verifyReqI> {
    let dir = this.logicUrl + 'Requerimiento/Verify/' + numReq + '?ProyectId=' + projectId
    return this.http.get<verifyReqI>(dir, { context: skipApiKey() })
  }

  verifyRangeSararial(perfilId: number, value: number, anio: number): Observable<verifyReqI> {
    let dir = this.genericUrl + 'RangoSalarialPerfil/Validate?perfilId=' + perfilId + '&value=' + value + '&anio=' + anio
    return this.http.get<verifyReqI>(dir, { context: skipApiKey() })
  }
  postVerifyDataSaveI(form: verifyDataSaveI): Observable<responseVerifyDataSaveI> {
    let dir = this.logicUrl + 'Requerimiento/Verify'
    return this.http.post<responseVerifyDataSaveI>(dir, form)
  }

  putModificationRequestSend(form: saveDataEditI): Observable<any> {
    let dir = `${this.logicUrl}SolicitudMod/Guardar`;
    return this.http.put(dir, form);
  }
  getAllDataTemporalModified(projectId: number, requestId: number, reqTempId: number): Observable<getDataTemporalModifiedI> {
    let dir = this.logicUrl + 'Solicitud/' + requestId + '/Proyecto/' + projectId + '/Temporal/' + reqTempId + '/Modificaciones'
    return this.http.get<getDataTemporalModifiedI>(dir)
  }


}
