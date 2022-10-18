
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getFilesI } from 'src/app/Models/ModelsPAA/Files/Files.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  url: string = environment.baseUrl.logic + 'Files/';
  token = sessionStorage.getItem('token');

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.token,
  });
  constructor(private http: HttpClient) { }

  getAllFiles(idProject:number,idRequets: number): Observable<getFilesI>{
    let dir = this.url + idProject + '/'+idRequets + '/Files'
    return this.http.get<getFilesI>(dir,{ headers: this.headers });
  }
}
