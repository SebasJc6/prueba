import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { dataTableProjectI, filterProjectI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { Data } from 'src/models/paa-data';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
export interface ChipColor {
  name: string;
  color: ThemePalette;
}
const ELEMENT_DATA: dataTableProjectI[] = [
  { proyectoID: 1, codigoProyecto: 7791, nombre: 'IVC', estadoDesc: 'En Ejecucion', dependenciaOrigen: 'Servicios de salud y Aseguramiento', valorAsignado: 120000000, valorTotal: 80000000 }
];


@Component({
  selector: 'app-acquisitions',
  templateUrl: './acquisitions.component.html',
  styleUrls: ['./acquisitions.component.scss']
})
export class AcquisitionsComponent implements OnInit {
  tooltip = '';
  isApproved = false;
  disabledApproved = true;
  disabledExecute= false;
  data: dataTableProjectI[] = [];
  colorChip: any
  viewProjects: any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pagesSize = 0;
  displayedColumns: string[] = [
    'select',
    'entidadNombre',
    'codigoProyecto',
    'nombre',
    'valorAsignado',
    'valorTotal',
    'estadoDesc',
    'accion'
  ];
  // dataSource = new MatTableDataSource<dataTableProjectI>(ELEMENT_DATA);
  dataSource!: MatTableDataSource<dataTableProjectI>;
  selection = new SelectionModel<dataTableProjectI>(true, []);
  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  numberPages: number = 0;
  numberPage: number = 0;
  numberTake: number = 0;

  constructor(
    private serviceProject: ProjectService, 
    public router: Router) {

  }
  filterProjects = {} as filterProjectI;
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  filterForm = new FormGroup({
    DependenciaOrigen: new FormControl(),
    CodigoProyecto: new FormControl(''),
    Nombre: new FormControl(''),
    EstadoDesc: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  })

  ngAfterViewInit() {
    if (this.isApproved === true) {
      this.tooltip = 'Ejecutar'
    } else if(this.isApproved === false){
      this.tooltip = 'Aprobar'
    }
  }

  ngOnInit(): void {
    this.ngAfterViewInit();

    this.filterProjects.page = "1";
    this.filterProjects.take = 20;
    this.getAllProjects(this.filterProjects);
  }

  getAllProjects(filterProjects: filterProjectI) {
    //console.log(filterProjects)
    this.serviceProject.getAllProjectsFilter(filterProjects).subscribe(data => {
      this.viewProjects = data
      // console.log(this.viewProjects.data.items)
      this.dataSource = new MatTableDataSource(this.viewProjects.data.items);
      this.numberPage = this.viewProjects.data.page;
      this.numberPages = this.viewProjects.data.pages;
      this.numberTake = filterProjects.take;
      this.paginationForm.setValue({
        take: filterProjects.take,
        page: filterProjects.page
      })
      if (this.viewProjects.data.items.estadoDesc == "Aprobado") {
        this.colorChip = 'passedChips'
      } else if (this.viewProjects.data.items.estadoDesc == "Cerrado") {
        this.colorChip = 'closeChips'
      }

    })

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getPagination() {
    //  console.log('form', this.paginationForm.value)
    this.filterProjects.page = this.paginationForm.get('page')?.value;;
    this.filterProjects.take = this.paginationForm.get('take')?.value;
    // console.log('get', this.filterProjects);
    this.getAllProjects(this.filterProjects);
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterProjects.page = this.numberPage.toString();
      this.getAllProjects(this.filterProjects);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterProjects.page = this.numberPage.toString();
      this.getAllProjects(this.filterProjects);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterProjects.page = this.numberPage.toString();
    this.getAllProjects(this.filterProjects);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterProjects.page = this.numberPage.toString();
    this.getAllProjects(this.filterProjects);
  }


  openRequeriment(proyectoID: number) {
    this.router.navigate(['/PAA/Requerimientos', proyectoID])
  }
  openAbstract(proyectoID: number) {
    this.router.navigate(['/PAA/Resumen', proyectoID])
  }
  changeExecution(proyectoID: number) {   
    this.serviceProject.patchExecutionProject(proyectoID).subscribe(data => {
      this.getAllProjects(this.filterProjects);
      this.isApproved = true;
      console.log(data)
    })
  }
  changeStatus(proyectoID: number) {   
    this.serviceProject.patchStatusProject(proyectoID).subscribe(data => {
      this.getAllProjects(this.filterProjects);
      this.isApproved = true;
      console.log(data)
    })
  }

}
