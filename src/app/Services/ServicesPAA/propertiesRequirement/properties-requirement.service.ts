import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, skipWhile, tap} from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { getAllContractualActionI, getAllDependenciesI, getAllSelectionModeDataI, getAllSelectionModeI, getInfoToCreateReqI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesRequirementService {

  logicUrl: string = environment.baseUrl.logic + 'proyecto/';
  genericUrl: string = environment.baseUrl.generic;


  constructor(private http: HttpClient) { }

  getInfoToCreateReq(projectId: number): Observable<getInfoToCreateReqI> {
    let dir = this.logicUrl + projectId + '/GetInfoToCreateReq'
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

  getAllSelectionMode(): Observable<getAllSelectionModeI>{
    let dir = this.genericUrl + 'ModalidadDeSeleccion'
    return this.http.get<getAllSelectionModeI>(dir);
  }

  getSelectionModeElastic(value: string): Observable<getAllSelectionModeI>{
    let dir = this.genericUrl + 'ModalidadDeSeleccion/Elastic?cod=' + value
    return this.http.get<getAllSelectionModeI>(dir);
  }
  getAllContractualAction(): Observable<getAllContractualActionI>{
    let dir = this.genericUrl + 'Actuacion'
    return this.http.get<getAllContractualActionI>(dir);
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
