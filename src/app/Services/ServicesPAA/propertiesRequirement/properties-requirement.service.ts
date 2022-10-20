import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, skipWhile, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { getAllActivitiesI, getAllAuxiliarI, getAllContacTypeI, getAllContractualActionI, getAllDependenciesI, getAllFuentesI, getAllMGAI, getAllPOSPREI, getAllProfileI, getAllReviewsAreaI, getAllSelectionModeDataI, getAllSelectionModeI, getAllUNSPSCI, getConceptsI, getDataAprobadaI, getDataTemporalI, getInfoToCreateReqI, responseVerifyDataSaveI, saveDataEditI, verifyDataSaveI, verifyReqI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PropertiesRequirementService {

  logicUrl: string = environment.baseUrl.logic;
  genericUrl: string = environment.baseUrl.generic;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getInfoToCreateReq(projectId: number): Observable<getInfoToCreateReqI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'proyecto/' + projectId + '/GetInfoToCreateReq'
    return this.http.get<getInfoToCreateReqI>(dir,{ headers: headers });
  }

  getAllDependencies(): Observable<getAllDependenciesI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'Dependencia'
    return this.http.get<getAllDependenciesI>(dir,{ headers: headers });
  }

  getDependenceElastic(value: string): Observable<getAllDependenciesI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'Dependencia/Elastic?cod=' + value
    return this.http.get<getAllDependenciesI>(dir,{ headers: headers });
  }

  getAllSelectionMode(): Observable<getAllSelectionModeI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'ModalidadDeSeleccion'
    return this.http.get<getAllSelectionModeI>(dir,{ headers: headers });
  }

  getSelectionModeElastic(value: string): Observable<getAllSelectionModeI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'ModalidadDeSeleccion/Elastic?cod=' + value
    return this.http.get<getAllSelectionModeI>(dir,{ headers: headers });
  }
  getAllContractualAction(): Observable<getAllContractualActionI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'Actuacion'
    return this.http.get<getAllContractualActionI>(dir,{ headers: headers });
  }

  getAllContacType(): Observable<getAllContacTypeI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'TipoContrato'
    return this.http.get<getAllContacTypeI>(dir,{ headers: headers })
  }

  getAllProfile(): Observable<getAllProfileI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'Perfil'
    return this.http.get<getAllProfileI>(dir,{ headers: headers })
  }

  getAuxiliarElastic(value: string): Observable<getAllAuxiliarI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'Auxiliar/Elastic?cod=' + value
    return this.http.get<getAllAuxiliarI>(dir,{ headers: headers })
  }

  getAuxiliarByProject(projectId: number): Observable<getAllAuxiliarI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Proyecto/' + projectId + '/Auxiliares'
    return this.http.get<getAllAuxiliarI>(dir,{ headers: headers })
  }

  getFuentesElastic(value: string): Observable<getAllFuentesI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'Fuente/Elastic?cod=' + value
    return this.http.get<getAllFuentesI>(dir,{ headers: headers })
  }

  getFuentesByProject(projectId: number): Observable<getAllFuentesI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Proyecto/' + projectId + '/FuentesComplete'
    return this.http.get<getAllFuentesI>(dir,{ headers: headers })
  }

  getAllActivities(projectId: number): Observable<getAllActivitiesI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'proyecto/' + projectId + '/Actividades'
    return this.http.get<getAllActivitiesI>(dir,{ headers: headers })
  }

  getMGAElastic(value: string): Observable<getAllMGAI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'MGA/Elastic?cod=' + value
    return this.http.get<getAllMGAI>(dir,{ headers: headers })
  }

  getPOSPREElastic(value: string): Observable<getAllPOSPREI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'POSPRE/Elastic?cod=' + value
    return this.http.get<getAllPOSPREI>(dir,{ headers: headers })
  }

  getUNSPSCElastic(value: string): Observable<getAllUNSPSCI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'UNSPSC/Elastic?cod=' + value
    return this.http.get<getAllUNSPSCI>(dir,{ headers: headers })
  }

  getAllReviewsArea(): Observable<getAllReviewsAreaI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'AreaRevision'
    return this.http.get<getAllReviewsAreaI>(dir,{ headers: headers })
  }

  getAllConcepts(): Observable<getConceptsI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'AreaRevision/Conceptos'
    return this.http.get<getConceptsI>(dir,{ headers: headers })
  }

  getAllDataTemporal(projectId: number, requestId: number, reqTempId: number): Observable<getDataTemporalI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Solicitud/' + requestId + '/Proyecto/' + projectId + '/Temporal/' + reqTempId
    return this.http.get<getDataTemporalI>(dir,{ headers: headers })
  }
  getDataAprobad(projectId: number, requerimetId: number): Observable<getDataAprobadaI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + '/Proyecto/' + projectId + '/Requerimiento/' + requerimetId
    return this.http.get<getDataAprobadaI>(dir,{ headers: headers })
  }

  verifyNumReq(projectId: number, numReq: number): Observable<verifyReqI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Requerimiento/Verify/' + numReq + '?ProyectId=' + projectId
    return this.http.get<verifyReqI>(dir,{ headers: headers })
  }

  verifyRangeSararial(perfilId: number, value: number): Observable<verifyReqI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.genericUrl + 'RangoSalarialPerfil/Validate?perfilId=' + perfilId + '&value=' + value
    return this.http.get<verifyReqI>(dir,{ headers: headers })
  }
  postVerifyDataSaveI(form: verifyDataSaveI): Observable<responseVerifyDataSaveI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Requerimiento/Verify'
    return this.http.post<responseVerifyDataSaveI>(dir, form,{ headers: headers })
  }

  putModificationRequestSend(form: saveDataEditI): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = `${this.logicUrl}SolicitudMod/Guardar`;
    return this.http.put(dir, form,{ headers: headers });
  }
}
