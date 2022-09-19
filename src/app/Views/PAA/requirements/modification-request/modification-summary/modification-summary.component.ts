import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

export interface Transaction
{
  pospre:           number;
  mga:              number;
  auxiliar:         number;
  actividad:        number;
  sumaAumenta:      number;
  sumaDisminuye:    number;
  diferencia:       number;

}

@Component({
  selector: 'app-modification-summary',
  templateUrl: './modification-summary.component.html',
  styleUrls: ['./modification-summary.component.scss']
})
export class ModificationSummaryComponent implements OnInit {

  constructor(  public router: Router) { }


  states: string[] = [
    '570-SGP-Participaciones para Salud',
    '574-SGP-Participaciones para Salud',
    '550-SGP-Participaciones para Salud',
    '540-SGP-Participaciones para Salud',
  ];


  displayedColumns: string      [] = [
    'pospre',
    'mga',
    'auxiliar',
    'actividad',
    'sumaAumenta',
    'sumaDisminuye',
    'diferencia',
  ];

  dataSource:       Transaction [] = [
    {pospre:123456789123456,mga:1901007,auxiliar:93,actividad:18.1,sumaAumenta:38149.340, sumaDisminuye:38.149340,diferencia:0},
    {pospre:123456789123456,mga:1901007,auxiliar:93,actividad:18.1,sumaAumenta:38149.340, sumaDisminuye:38.149340,diferencia:0},
    {pospre:123456789123456,mga:1901007,auxiliar:93,actividad:18.1,sumaAumenta:38149.340, sumaDisminuye:38.149340,diferencia:0},
    {pospre:123456789123456,mga:1901007,auxiliar:93,actividad:18.1,sumaAumenta:38149.340, sumaDisminuye:38.149340,diferencia:0},
    {pospre:123456789123456,mga:1901007,auxiliar:93,actividad:18.1,sumaAumenta:38149.340, sumaDisminuye:38.149340,diferencia:0},

  ];

  ngOnInit(): void {
  }

  getSumaAumenta(){
    return this.dataSource.map(t => t.sumaAumenta).reduce((acc, value) => acc + value, 0);
  }
  getSumaDisminuye(){
    return this.dataSource.map(t => t.sumaDisminuye).reduce((acc, value) => acc + value, 0);
  }
  getValorDiferencia(){
    return this.dataSource.map(t => t.diferencia).reduce((acc, value) => acc + value, 0);
  }


  regresar(){
    this.router.navigate(['/PAA/SolicitudModificacion/data'])
  }

}