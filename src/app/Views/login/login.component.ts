import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //  loginForm = new FormGroup<LoginI>({
  //   userName : new FormControl<string>('', { nonNullable: true }),
  //   password : new FormControl<string>('', { nonNullable: true })
  // });
  public loginForm!: FormGroup;
  dataToken: any;

  // tokenIn = new FormGroup({
  //   token: new FormControl(''),
  //   traceSource: new FormControl(''||null)
  // })


  constructor(private router: Router,
    private ServicesAuth: AuthenticationService,
    private snackBar: MatSnackBar, private authService: AuthenticationService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('token');

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  public myError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  onLogin() {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);
      // let isSuccessful =
       this.ServicesAuth.login(this.loginForm.value).subscribe(dataToken => {
        // console.log('dataToken: ',dataToken.accessToken);
        this.dataToken = dataToken;
        this.authService.setCookie('token', this.dataToken.accessToken);
        const tokenInfo: any  =  this.decodeToken(this.dataToken.accessToken);
        // console.log('tokenInfo',tokenInfo);
        let access = JSON.parse(tokenInfo.access);
        // console.log('access',access);
        this.router.navigate(['WAPI/Home']);      
      }, error => {
        // console.log('error', error);
        this.openSnackBar('Error', 'Usuario o contraseña incorrectos', 'error');
      });
    }
  }

  
  /**decodifica el token */
  decodeToken(token: string) {
    try{
      return jwt_decode(token)
    }catch(Error){
      return null;
    }
  }
 
  //Metodo para llamar alertas
  openSnackBar(title: string, message: string, type: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data: { title, message, type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }
}
