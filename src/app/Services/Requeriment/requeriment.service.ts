import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getRequerimentsByProjectI } from 'src/app/Models/Project/Project.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequerimentService {
  url: string = environment.baseUrl + 'Proyecto/';

  constructor(private http: HttpClient) { }

  getRequerimentsByProject(projectId: number): Observable<getRequerimentsByProjectI> {
    let dir = this.url + projectId + '/Requerimientos';
    return this.http.get<getRequerimentsByProjectI>(dir);
  }

}
