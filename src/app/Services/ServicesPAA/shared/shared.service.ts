import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../Authentication/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
const { PROCEDURE_SHARED_URI } = environment;
const { PROCEDURE_SECURITY_URI } = environment;
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  dataToken: any;
  constructor(  private msalService: MsalService,private http: HttpClient, private user: AuthenticationService,
    private spinner: NgxSpinnerService, private router : Router ) { }

  //Función que ajusta el formato de inputs a numericos
  validateFormat(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
  }
    /**
   * Obtiene codigo de ventanilla de un usuario dado su oid del B2C
   * @param oidToken_usuario Id dado por el b2c
   */
    public getCodeVentanillaByIdUser(oidToken_usuario: string) : Observable<any> {
      return this.http.get(`${PROCEDURE_SECURITY_URI}/GetCodeVentanillaByIdUser/${oidToken_usuario}`);
    }

    /**
     * Obtiene la informacion de un usuario dado su codigo de ventanilla
     * @param idCode Codigo de ventanilla a buscar
     */
    public getInfoUserByIdCodeVentanilla(idCode: any): Observable<any> {
      return this.http.get(`${PROCEDURE_SHARED_URI}/v2/Persona/GetInfoUserById/${idCode}`);
    }
    getRoleByIdUser(oid: string) : Observable<any> {
      return this.http.get(`${PROCEDURE_SECURITY_URI}/GetRoleByIdUser/${oid}`);
    }
  public B2CLogin(): any {

    this.msalService.loginPopup().subscribe({
      next:res =>
      {

        // @ts-ignore
          let emailUser= res.idTokenClaims.emails[0];
        // @ts-ignore
          let oid = res.idTokenClaims.oid;
        // @ts-ignore
          let name = res.idTokenClaims.name;
          const info = {
            email: emailUser,
            pwp: "12345",
            nombre: name,
            rolID: 1,
            azureID: oid
          }
          this.spinner.show();
          // if registrado llamar api para traer token 76
          this.user.b2cLogin(info).subscribe(dataToken => {

            this.dataToken = dataToken;
            this.user.setCookie('token', this.dataToken.accessToken);
            localStorage.setItem("b2c", "true")
            this.router.navigate(['WAPI/Home']);
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          });
      }

    })
  }
}
