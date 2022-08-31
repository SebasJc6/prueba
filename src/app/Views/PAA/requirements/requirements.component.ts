import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { dataTableRequerimentI } from 'src/app/Models/Requeriment/Requeriment.interface';
import { RequerimentService } from 'src/app/Services/Requeriment/requeriment.service';
import { Data } from 'src/models/paa-data';
import { RequerimientosService } from 'src/services/requerimientos/requerimientos.service';


@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {
  resultsLength = 0;
  pagesSize = 0;
  viewRequeriments: any;

  constructor(
    public serviceRequeriment: RequerimentService,
    public router: Router,
    private activeRoute: ActivatedRoute,) { }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataProjectID = '';

  requirementInfo = [{
    numrequired: 4528,
    dependency: 1234,
    description: 'prestar serviciosd de trasporte',
    estado: 'Activo',
    accion: 1
  }]

  requireService: any;

  displayedColumns: string[] = [
    'numrequired',
    'dependenci',
    'description',
    'estado',
    'accion',
  ];

  dataSource!: MatTableDataSource<dataTableRequerimentI>;

  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';
    // console.log(+this.dataProjectID)
    this.getRequerimentsByProject(+this.dataProjectID)
  }


  getRequerimentsByProject(projectId: number) {
    this.serviceRequeriment.getRequerimentsByProject(projectId).subscribe((data) => {
      this.viewRequeriments = data;
      console.log(this.viewRequeriments.data.requerimientos.items)
      this.dataSource = new MatTableDataSource(this.viewRequeriments.data.requerimientos.items);
      console.log(this.viewRequeriments.data.requerimientos)
      this.resultsLength = this.viewRequeriments.data.requerimientos.total
      this.pagesSize = this.viewRequeriments.data.requerimientos.pages
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  resumenejecucion(contact: Data) {
    let route = '../abstract';
    this.router.navigate([route], { queryParams: { id: contact.numrequired } });
  }


}
