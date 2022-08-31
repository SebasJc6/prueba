import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getProjectI } from 'src/app/Models/Project/Project.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
 url: string = environment.baseUrl + 'Proyecto';

  constructor(private http: HttpClient) { }

  getAllProjects():  Observable<getProjectI>{
    let dir = this.url;
    return this.http.get<getProjectI>(dir);
  }
}
