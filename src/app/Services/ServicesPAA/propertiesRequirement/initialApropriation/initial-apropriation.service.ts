import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getAllInitialApropriationI } from 'src/app/Models/ModelsPAA/propertiesRequirement/initialApropriation/initialApropriation.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitialApropriationService {
  
  logicUrl: string = environment.baseUrl.logic;
  genericUrl: string = environment.baseUrl.generic;

  constructor(private http: HttpClient) { }  

  getAllInitialApropriation(reqId: number, anio: number): Observable<getAllInitialApropriationI> {
    let dir = this.logicUrl + 'Apropiaciones/' + reqId + '/' + anio
    return this.http.get<getAllInitialApropriationI>(dir);
  }
  getAllInitialApropriationTemp(reqId: number, anio: number, idSol: number) :Observable<getAllInitialApropriationI> {
    let dir = this.logicUrl + 'Apropiaciones/temporal/' + reqId + '/' + anio + '/' + idSol
    return this.http.get<getAllInitialApropriationI>(dir);
  }
}
