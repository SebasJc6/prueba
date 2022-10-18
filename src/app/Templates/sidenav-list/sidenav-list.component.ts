import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();



  constructor(private observer: BreakpointObserver,
    private router: Router,) { }


  ngOnInit(): void {
    
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}

