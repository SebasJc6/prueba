import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';

export interface TableInfo {
  mes: number;
  vigenciaRecursos: number;
  auxiliar: number;
  detalleFuente: string;
  actividad: number;
  meta: string;
  fuente: string;
  fuenteMSPS: string;
  MGA: number;
  pospre: string;
  apropiacionDisponible: number;
  aumento: number;
  disminucion: number;
  apropiacionDefinitiva: number;
  compromisos: number;
  giros: number;
}

export interface TableCodigos{
  codigo: number;
  descripcion: string;
}

export interface TableRevisiones{
  fecha: string;
  usuario: string;
  area: string;
  concepto: string;
  observacion: string;
  revision: boolean;
}

const REVISION_DATA: TableRevisiones[] = [
  {fecha: '21-08-2022', usuario: 'Carmen Torres', area: 'Contrataciones', concepto: 'Cantidad de contratos', observacion: 'Se devuelve para ajuste de la cantidad de contratos solicitados', revision: true},
  {fecha: '23-08-2022', usuario: 'Raul gonzalez', area: 'Financiera', concepto: 'Campo XXXX', observacion: 'Modificar XXXX', revision: false}
];

const CODIGOS_DATA: TableCodigos[] = [
  {codigo: 78111800, descripcion: 'Transporte de pasajeros por la carretera'},
  {codigo: 80111623, descripcion: 'Servicios temporales de compras y logística'}
];

const ELEMENT_DATA: TableInfo[] = [
  {mes: 1, vigenciaRecursos: 2022, auxiliar: 1061, detalleFuente: '012 - Aporte Ordinario', actividad: 1.6, meta: '01', fuente: '012', fuenteMSPS:'07', MGA: 1903023, pospre: 'O232020200', apropiacionDisponible: 60000000, aumento: 140000, disminucion: 0, apropiacionDefinitiva: 200000000, compromisos: 0, giros: 100000000},
  {mes: 2, vigenciaRecursos: 2022, auxiliar: 1007, detalleFuente: '012 - Aporte Ordinario', actividad: 1.1, meta: '01', fuente: '007', fuenteMSPS:'07', MGA: 2301024, pospre: 'O232010100', apropiacionDisponible: 40000000, aumento: 0, disminucion: 10000000, apropiacionDefinitiva: 30000000, compromisos: 0, giros: 100000000},
];

@Component({
  selector: 'app-properties-requirement',
  templateUrl: './properties-requirement.component.html',
  styleUrls: ['./properties-requirement.component.scss']
})
export class PropertiesRequirementComponent implements OnInit {
  dataRequirementID = '';

  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['mes','vigenciaRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  dataSource = ELEMENT_DATA;

  //INFORMACION PARA LA TABLA CODIGOS UNSPSC
  codigosColumns: string[] = ['codigoUNSPSC','descripcion','eliminar'];
  dataCodigos = CODIGOS_DATA;

  //INFORMACION PARA LA TABLA REVICIONES
  revisionesColumns: string[] = ['fecha','usuario','area', 'concepto', 'observacion', 'revision','eliminar'];
  dataRevisiones = REVISION_DATA;


  constructor(
    public serviceRequeriment: ProjectService,
    public router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dataRequirementID = this.activeRoute.snapshot.paramMap.get('data') || '';
     //console.log(+this.dataProjectID)
  }


  cancelar() {
    this.router.navigate(['/PAA/Requerimientos/'])
  }

}
