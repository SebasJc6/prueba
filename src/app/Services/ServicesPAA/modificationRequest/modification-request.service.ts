import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { filterModificationRequestI, getModificationRequestByRequesI, getModificationRequestI, modificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class ModificationRequestService {


  readonly Url: string= environment.baseUrl.logic ;

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

  getModificationRequestByRequestId(idRequets: number,formFilter: filterModificationRequestI): Observable<getModificationRequestByRequesI>{
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
    return this.http.get<getModificationRequestByRequesI>(dir);
  }


}
