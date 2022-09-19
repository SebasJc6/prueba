import { Data } from '../../models/paa-data';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from '../base-service/base.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class FfdsService {

  constructor(private baseservice:BaseService)
  {
  }


getFFDS():Observable<Data[]>{
  return this.baseservice.getData<Data[]>();
}



}
