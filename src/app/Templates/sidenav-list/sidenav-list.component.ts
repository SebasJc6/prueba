import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
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
    private spinner: NgxSpinnerService, private msal: MsalService) { }

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
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logOut() {
    console.log("cerro sesion")
    console.log("prueba log out b2c", localStorage.getItem("b2c"));
    if(localStorage.getItem("b2c") == "false"){
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
    }else{
      let msalInstance: PublicClientApplication = this.msal.instance as PublicClientApplication;
      msalInstance['browserStorage'].clear();
      msalInstance['nativeInternalStorage'].clear();
      console.log("entro borrado")
      localStorage.clear();
      this.authService.rmCookie();

      sessionStorage.clear();

      this.msal.logoutPopup().subscribe( resp =>
        {
          this.router.navigate([`/`]).then(value => {
          })
        });
    }

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

