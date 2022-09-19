import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private VERB = {
    get:"GET",
    post:"POST",
    put:"PUT",
    delete:"DELETE"
  }


  public uri:string='';


  constructor(private http: HttpClient) {

  }


  addData = <T> (obj: T) => {
    let httpOptions = this.buildOptions(this.VERB.post, obj);
    return this.http.post<T>(this.uri, obj, httpOptions);
  }

  getData = <T> () => this.http.get<T>(this.uri);

  getDataById = <T> (id:any) => this.http.get<T>(this.uri + id);

  updateData = <T> (id: any, obj: T) => {
    let httpOptions = this.buildOptions(this.VERB.put, obj);
    return this.http.put<T>(this.uri + id, obj, httpOptions);
  }

  deleteData = <T> (id: any) => {
    let httpOptions = this.buildOptions(this.VERB.delete);
    return this.http.delete<T>(this.uri + id, httpOptions);
  }

  private buildOptions(meth:string, obj?:any):any{
    let options = {};

    if (obj !== null && meth !== "DELETE")
    {
      options = {
        method: meth,
        headers: {
          'Content-Type': 'application/json'
          //'Authorization': 'jwt-token'
        },
        body: JSON.stringify(obj)
      }

    }else
    {
      options = {
        method: meth,
        headers: {
          'Content-Type': 'application/json'
          //'Authorization': 'jwt-token'
        }
      }
    }

    return options;
}



}
