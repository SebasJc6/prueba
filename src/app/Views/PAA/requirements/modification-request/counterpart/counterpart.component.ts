
import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RequerimentService } from 'src/app/Services/ServicesPAA/Requeriment/requeriment.service';
import { AddrequirementsComponent } from '../add-requeriments/add-requeriments.component';

@Component({
  selector: 'app-counterpart',
  templateUrl: './counterpart.component.html',
  styleUrls: ['./counterpart.component.scss']
})
export class CounterpartComponent implements OnInit {

  constructor(public router: Router,
    public serviceRequeriment: RequerimentService,
    public dialogRef: MatDialogRef<AddrequirementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,) 
    { dialogRef.disableClose = true;}

  states: string[] = [
    '570-SGP-Participaciones para Salud',
    '574-SGP-Participaciones para Salud',
    '550-SGP-Participaciones para Salud',
    '540-SGP-Participaciones para Salud',
  ];

  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  ngOnInit(): void {
    console.log('idProject',this.data)
  }

}