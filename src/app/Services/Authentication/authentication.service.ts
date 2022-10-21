import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { loginI, tokenI } from 'src/app/Models/Authentication/authentication.interface';
import { environment } from 'src/environments/environment';

import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  urlAuth = environment.baseUrl.auth;

  constructor(private http: HttpClient,  private cookie: CookieService) { }

  login(form: loginI){
    let dir = this.urlAuth + 'auth/login';
    return this.http.post<tokenI>(dir, form);
  }

  getCookie(name: string) {
    return this.cookie.get(name);
  }

  setCookie(name: string, value: string) {
    this.cookie.set(name, value);
  }

  rmCookie() {
    this.cookie.deleteAll();
  }

  getRolUser(): string {
    const tokenInfo: any  =  this.decodeToken(this.cookie.get('token'));
    const TokenAccess = JSON.parse(tokenInfo.access);
    return TokenAccess[0].RolesDto[0].Rol;
  }

  /**decodifica el token */
  decodeToken(token: string) {
    try{
      return jwt_decode(token)
    }catch(Error){
      return null;
    }
  }
}
