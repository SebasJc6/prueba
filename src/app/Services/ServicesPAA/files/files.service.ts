
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getFilesI } from 'src/app/Models/ModelsPAA/Files/Files.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  url: string = environment.baseUrl.logic + 'Files/';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAllFiles(idProject:number,idRequets: number): Observable<getFilesI>{

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.url + idProject + '/'+idRequets + '/Files'
    return this.http.get<getFilesI>(dir,{ headers: headers });
  }
}
