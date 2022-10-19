import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { dataTableRequerimentI, filterRequerimentI } from 'src/app/Models/ModelsPAA/Requeriment/Requeriment.interface';
import { RequerimentService } from 'src/app/Services/ServicesPAA/Requeriment/requeriment.service';



const ELEMENT_DATA: dataTableRequerimentI[] = [
  { requerimientoId: 1, numeroRequerimiento: 1, dependenciaDestino: '022100', descripcion: '001-022100_7791 Prestar el sevicio de tranporte de personal en la secretaria Distrital de Salud', estado: 'Aprobado' }
];


@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {
  resultsLength = 0;
  viewRequeriments: any;
  projectId = 0;
  requeriments: any;
  disabled = false;
  viewOrder = false;
  codProject = '';
  nomProject = '';
  constructor(
    public serviceRequeriment: RequerimentService,
    public router: Router,
    private activeRoute: ActivatedRoute,) {

  }

  filterRequertiments = {} as filterRequerimentI;
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  filterForm = new FormGroup({
    NumeroRequerimiento: new FormControl(),
    DependenciaDestino: new FormControl(''),
    Descripcion: new FormControl(''),
    Estado: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  })

  pageSizeOptions: number[] = [5, 10, 15, 20];
  estadoFilter: string[] = ['Todos', 'En Ajuste', 'En Revisión', 'Aprobado', 'En Modificación']
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  viewFilter: boolean = true;
  numberPagination: any;
  numberPages: number = 0;
  numberPage: number = 0;
  numberTake: number = 0;
  dataProjectID: string = '';

  displayedColumns: string[] = [
    'numrequired',
    'dependenci',
    'description',
    'estado',
    'accion',
  ];

  dataSource!: MatTableDataSource<dataTableRequerimentI>;

  ngOnInit(): void {
    this.filterRequertiments.page = "1";
    this.filterRequertiments.take = 20;
    // this.getPagination();
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';

    // console.log(+this.dataProjectID)
    this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);

  }

  getPagination() {
    //console.log(this.paginationForm.value);
    this.filterRequertiments.page = this.paginationForm.get('page')?.value;
    this.filterRequertiments.take = this.paginationForm.get('take')?.value;
    this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);

  }

  getRequerimentsByProject(projectId: number, filterRequertiments: filterRequerimentI) {
    this.projectId = projectId;
    if (this.filterForm.value.Estado == 'Todos') {
      this.filterRequertiments.Estado = ' ';
    } else {
      this.filterRequertiments.Estado = this.filterForm.get('Estado')?.value || '';

    }
    this.filterRequertiments.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterRequertiments.DependenciaDestino = this.filterForm.get('DependenciaDestino')?.value || '';
    this.filterRequertiments.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    this.filterRequertiments.columna = this.filterForm.get('columna')?.value || '';
    this.filterRequertiments.ascending = this.filterForm.get('ascending')?.value || false;
    this.serviceRequeriment.getRequerimentsByProject(projectId, filterRequertiments).subscribe((data) => {
      this.viewRequeriments = data;
      this.dataSource = new MatTableDataSource(this.viewRequeriments.data.requerimientos.items);
     // console.log(this.viewRequeriments.data.requerimientos.items);
      // this.requeriments = this.viewRequeriments.data.requerimientos.items;
      this.codProject = this.viewRequeriments.data.codigoProyecto;
      this.nomProject = this.viewRequeriments.data.nombre;
      //console.log(this.viewRequeriments.data.proyectoId)
      this.numberPages = this.viewRequeriments.data.requerimientos.pages;
      this.numberPage = this.viewRequeriments.data.requerimientos.page;
      this.numberTake = filterRequertiments.take
      this.paginationForm.setValue({
        take: filterRequertiments.take,
        page: filterRequertiments.page
      })
      this.numberPagination = this.viewRequeriments.data.requerimientos.pages
    })

  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterRequertiments.page = this.numberPage.toString();
      this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);
    }
  }

  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterRequertiments.page = this.numberPage.toString();
      this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterRequertiments.page = this.numberPage.toString();
    this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterRequertiments.page = this.numberPage.toString();
    this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);
  }

  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    //console.log(this.filterForm.value)
    this.filterRequertiments.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterRequertiments.DependenciaDestino = this.filterForm.get('DependenciaDestino')?.value || '';
    this.filterRequertiments.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    this.filterRequertiments.columna = this.filterForm.get('columna')?.value || '';
    this.filterRequertiments.ascending = this.filterForm.get('ascending')?.value || false;

    this.getRequerimentsByProject(+this.dataProjectID, this.filterRequertiments);

    this.closeFilter();
  }


  resumenejecucion(contact: any) {
    let route = '../abstract';
    this.router.navigate([route], { queryParams: { id: contact.numrequired } });
  }


  regresar() {
    this.router.navigate(['/WAPI/PAA/Adquisiciones'])
  }
  propertiesRequirement(requirementId: number) {
    this.router.navigate(['/WAPI/PAA/PropiedadesRequerimiento/' + this.dataProjectID + '/0/' + requirementId+ '/Vista'])
  }

  CDP(requirementId: number) {
    this.router.navigate([`/WAPI/PAA/CDP/${this.dataProjectID}/${requirementId}`])
  }

  modificatioRequest() {
    this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/0' ])
  }

}
