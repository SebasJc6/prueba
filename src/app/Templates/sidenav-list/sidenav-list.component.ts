import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();



  constructor(private observer: BreakpointObserver,
    private router: Router,) { }

  UserName: string = '';

  ngOnInit(): void {
    const Token: string = sessionStorage.getItem('token') || '';
    const tokenInfo: any  =  this.decodeToken(Token);
    this.UserName = tokenInfo.name;
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate([`/`]);
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

