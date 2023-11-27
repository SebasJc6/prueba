import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { SharedService } from 'src/app/Services/ServicesPAA/shared/shared.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import Swal from 'sweetalert2'

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
    private snackBar: MatSnackBar, private authService: AuthenticationService,
    private spinner: NgxSpinnerService, private shared: SharedService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('token');

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      Pwp: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  public myError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  onLogin() {
    console.log("prueba login anterior")
    if (this.loginForm.valid) {
      // let isSuccessful =
      this.spinner.show();
       this.ServicesAuth.login(this.loginForm.value).subscribe(dataToken => {
        this.dataToken = dataToken;
        this.authService.setCookie('token', this.dataToken.accessToken);
        localStorage.setItem("b2c", "false")
        this.router.navigate(['WAPI/Home']);

        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.openSnackBar('Error', 'Usuario o contraseña incorrectos', 'error');
      });
    }
  }


  // /**decodifica el token */
  // decodeToken(token: string) {
  //   try{
  //     return jwt_decode(token)
  //   }catch(Error){
  //     return null;
  //   }
  // }

  //Metodo para llamar alertas
  openSnackBar(title: string, message: string, type: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data: { title, message, type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }

  login(){
    this.shared.B2CLogin();
  }

}
