
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getFilesI, postFileI } from 'src/app/Models/ModelsPAA/Files/Files.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  url: string = environment.baseUrl.logic + 'Files/';

  constructor(private http: HttpClient) { }

  getAllFiles(idProject:number,idRequets: number): Observable<getFilesI>{
    let dir = this.url + idProject + '/'+idRequets + '/Files'
    return this.http.get<getFilesI>(dir);
  }

  postFile(form: postFileI): Observable<any>{
    let dir = this.url + 'Upload'
    return this.http.post<any>(dir, form);
  }

  deleteFile(blobName: string){
    let dir = this.url + 'DeleteFile/' 
    return this.http.delete(dir,{body:[blobName]});
    
  }
  dowloadFile(blobName: string){
    let dir = this.url + 'Download?BlobName=' + blobName
    return this.http.get(dir);
  }
}
