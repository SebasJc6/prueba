import { BaseService } from './../base-service/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Data } from '../../models/paa-data';

@Injectable({
  providedIn: 'root'
})

export class RequerimientosService {

  constructor(private baseservice: BaseService) {
  }

  getjsON(n: number){

  }

  getRequerimientos():Observable<Data[]>{
    return this.baseservice.getData<Data[]>();

  }
}
