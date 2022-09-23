import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface MSolicitadas {
  nSolicitud: string;
  vigencia: string;
  fechaPresentacion: string;
  codProyecto: string;
  proyecto: string;
  version: string;
  solicitante: string;
  estado: string;
  fechaAprobacion: string
}

const MOD_SOLICITADAS: MSolicitadas[] = [
  {nSolicitud: '00', vigencia: '2022', fechaPresentacion: '05-06-2022', codProyecto: '7791', proyecto: 'IVC', version: '01', solicitante: 'Johanna Reyes', estado: 'En Revisión', fechaAprobacion: '30-06-2022'},
  {nSolicitud: '02', vigencia: '2022', fechaPresentacion: '07-06-2022', codProyecto: '7822', proyecto: 'Aseguramiento', version: '04', solicitante: 'Mario Albarracin', estado: 'En Ajuste', fechaAprobacion: ''},
  {nSolicitud: '03', vigencia: '2023', fechaPresentacion: '07-06-2022', codProyecto: '7826', proyecto: 'Discapacidad', version: '02', solicitante: 'Luis Alejandro Diaz', estado: 'Aprobado', fechaAprobacion: ''},
]


@Component({
  selector: 'app-request-tray',
  templateUrl: './request-tray.component.html',
  styleUrls: ['./request-tray.component.scss']
})
export class RequestTrayComponent implements OnInit {


  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['solicitud', 'vigencia', 'fPresentacion', 'codigoP', 'proyecto', 'version', 'solicitante', 'estado', 'fAprobacion', 'accion'];
  dataSource = MOD_SOLICITADAS;

  pageSizeOptions: number[] = [5, 10, 15, 20];
  numberPages: number = 0;
  numberPage: number = 0;

  constructor() { }

  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  //CAMPOS PARA FILTRO
  filterForm = new FormGroup({
    NumeroSolicitud: new FormControl(),
    Vigencia: new FormControl(''),
    FechaPresentacion: new FormControl(''),
    CodigoProyecto: new FormControl(''),
    Proyecto: new FormControl(''),
    Version: new FormControl(''),
    Solicitante: new FormControl(''),
    Estado: new FormControl(''),
    FechaAprobacion: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  })

  estadoFilter: string[] = ['Todos', 'En Ajuste', 'En Revisión', 'Aprobado', 'En Modificación']
  viewFilter: boolean = true;
  viewOrder = false;

  ngOnInit(): void {
  }

  //PAGINACIÓN
  getPagination() {

  }

  nextPage() {

  }

  prevPage() {

  }

  firstPage() {

  }

  latestPage() {

  }

  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {

  }

}
