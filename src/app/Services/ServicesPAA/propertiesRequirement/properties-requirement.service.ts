import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, skipWhile, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { getAllActivitiesI, getAllAuxiliarI, getAllContacTypeI, getAllContractualActionI, getAllDependenciesI, getAllFuentesI, getAllMGAI, getAllPOSPREI, getAllProfileI, getAllReviewsAreaI, getAllSelectionModeDataI, getAllSelectionModeI, getAllUNSPSCI, getInfoToCreateReqI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
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

  getFuentesElastic(value: string): Observable<getAllFuentesI> {
    let dir = this.genericUrl + 'Fuente/Elastic?cod=' + value
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
  // getAllContractualAction(){

  // }

  // getDataDependencies(){
  //   return this.http.get('https://w-generic-back.azurewebsites.net/api/v1/Dependencia')
  //   .pipe(
  //     map((response:[]) => response.map(item => item['codigo']))
  //   )
  // }
}
