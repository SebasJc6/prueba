import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

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

  // tokenIn = new FormGroup({
  //   token: new FormControl(''),
  //   traceSource: new FormControl(''||null)
  // })


  constructor(private router: Router,
    private ServicesAuth: AuthenticationService,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
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
      console.log(this.loginForm.value);
      // let isSuccessful =
       this.ServicesAuth.login(this.loginForm.value).subscribe(dataToken => {
        this.router.navigate(['WAPI/Home']);      
      }, error => {
        console.log('error', error);
        this.openSnackBar('Error', 'Usuario o contraseña incorrectos', 'error');
      });
      // if (isSuccessful) {
      //   this.router.navigate(['WAPI/Home']);
      // } else {
      //   alert('Usuario o contraseña incorrectos');
      // }
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
