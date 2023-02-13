import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  constructor(private observer: BreakpointObserver,
    private router: Router, private authService: AuthenticationService,
    private spinner: NgxSpinnerService,) { }

  UserName: string = '';

  //Objeto con la informacion de acceso del Usuario
  AccessUser: string = '';

  ngOnInit(): void {
    const Token: string = this.authService.getCookie('token');
    const tokenInfo: any = this.decodeToken(Token);
    const decodedRole = tokenInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    const decodedName = tokenInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    

    this.UserName = decodedName

    //Obtener token para manejar los roles
    // const TokenAccess = JSON.parse(tokenInfo.access);
    this.AccessUser = decodedRole
    // console.log(this.AccessUser);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logOut() {
    localStorage.clear();
    this.authService.rmCookie();
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate([`/`]);
      this.spinner.hide();
      //limpiar local y sesion storege 
      localStorage.clear();
      sessionStorage.clear();

    }, 1700);
  }


  /**decodifica el token */
  decodeToken(token: string) {
    try {
      return jwt_decode(token)
    } catch (Error) {
      return null;
    }
  }
}

