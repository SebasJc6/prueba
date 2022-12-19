import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  codProject: number = 0;
  nomProject: string = '';

  actividadesColumns: string[] = ['codigoActividad', 'pospre', 'mga', 'auxiliar', 'fuente', 'valorRP','girosAcumulados' ,'saldoGirar', 'valorGirar','nuevoSaldo'];

  constructor() { }

  ngOnInit(): void {
  }

  cancel(){
    console.log('cancel');
  }
  saveGiro(){
    console.log('savegiros');
  }
}
