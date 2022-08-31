import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { dataTableProjectI } from 'src/app/Models/Project/Project.interface';
import { ProjectService } from 'src/app/Services/Project/project.service';
import { Data } from 'src/models/paa-data';



@Component({
  selector: 'app-acquisitions',
  templateUrl: './acquisitions.component.html',
  styleUrls: ['./acquisitions.component.scss']
})
export class AcquisitionsComponent implements OnInit {
  data: dataTableProjectI[] = [];

  viewProjects: any;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pagesSize = 0;
  displayedColumns: string[] = [
    'entidadNombre',
    'codigoProyecto',
    'nombre',
    'valorAsignado',
    'valorTotal',
    'estadoDesc',
    'accion'
  ];
  dataSource!: MatTableDataSource<dataTableProjectI>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private serviceProject: ProjectService, public router: Router) {    
  }

  
  ngAfterViewInit() {
    this.getAllProjects();
   
    
  }

  ngOnInit(): void {    
    this.ngAfterViewInit();
   
  }

  getAllProjects() {
    this.serviceProject.getAllProjects().subscribe(data => {
      this.viewProjects = data
      console.log(this.viewProjects.data)
      this.dataSource = new MatTableDataSource(this.viewProjects.data.items);
      this.resultsLength = this.viewProjects.data.total
      this.pagesSize = this.viewProjects.data.pages
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    })
  }


  requeriment(proyectoID: number) {
    this.router.navigate(['/Requerimientos',proyectoID])
  }


  


}
