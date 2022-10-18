import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  loginForm: any = {
    email: null,
    pwd: null,
  };

  // tokenIn = new FormGroup({
  //   token: new FormControl(''),
  //   traceSource: new FormControl(''||null)
  // })


  constructor(private router: Router,) {}

  ngOnInit(): void {}

  onLogin() {
    this.router.navigate(['WAPI/Home']);
   // let isSuccessful = await this.apiAuth.LoginByTokenAsync(this.loginForm);
    // if (isSuccessful) {
    //   this.router.navigate(['/EvaluateProject']);
    // } else {
    //   alert('Usuario o contraseña incorrectos');
    // }
  }
  Investigador() {

  }

}
