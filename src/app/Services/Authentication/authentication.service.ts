import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginI, tokenI } from 'src/app/Models/Authentication/authentication.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  urlAuth = environment.baseUrl.auth;

  constructor(private http: HttpClient) { }

  login(form: loginI){
    let dir = this.urlAuth + 'auth/login';
    return this.http.post<tokenI>(dir, form);
  }
}
