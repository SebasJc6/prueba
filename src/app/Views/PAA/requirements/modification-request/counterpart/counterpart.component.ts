
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-counterpart',
  templateUrl: './counterpart.component.html',
  styleUrls: ['./counterpart.component.scss']
})
export class CounterpartComponent implements OnInit {

  constructor(public router: Router) { }

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
  }

  regresar(){
    this.router.navigate(['/PAA/SolicitudModificacion'])
  }

}