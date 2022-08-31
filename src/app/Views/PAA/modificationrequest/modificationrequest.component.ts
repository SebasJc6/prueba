import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/Services/Project/project.service';
import { Data } from 'src/models/paa-data';

export interface ChipColor {
  name: string;
  color: ThemePalette;
}


@Component({
  selector: 'app-modificationRequest',
  templateUrl: './modificationRequest.component.html',
  styleUrls: ['./modificationRequest.component.scss']
})
export class ModificationRequestComponent implements OnInit {


valor1= '7791';
valor2= '06';



  dataSource =
  [
    { numrequire:1234456789,dependency :7791,description : '001-022100 Prestar el servico de trasporte del personal de Secretaria Distrital de Salud', actividad: 12,pospre:1232456789,auxiliar:110,mga:190304,fuente:123,saldorequerimiento:'$16030',valorqueaumenta:0,valorquedisminuye:16030,nuevosaldodeapripiacion:0,accion:1},
    { numrequire:1234456789,dependency :7791,description : '001-022100 Prestar el servico de trasporte del personal de Secretaria Distrital de Salud', actividad: 12,pospre:1232456789,auxiliar:110,mga:190304,fuente:123,saldorequerimiento:'$16030',valorqueaumenta:0,valorquedisminuye:16030,nuevosaldodeapripiacion:0,accion:1},
    { numrequire:1234456789,dependency :7791,description : '001-022100 Prestar el servico de trasporte del personal de Secretaria Distrital de Salud', actividad: 12,pospre:1232456789,auxiliar:110,mga:190304,fuente:123,saldorequerimiento:'$16030',valorqueaumenta:0,valorquedisminuye:16030,nuevosaldodeapripiacion:0,accion:1},
    { numrequire:1234456789,dependency :7791,description : '001-022100 Prestar el servico de trasporte del personal de Secretaria Distrital de Salud', actividad: 12,pospre:1232456789,auxiliar:110,mga:190304,fuente:123,saldorequerimiento:'$16030',valorqueaumenta:0,valorquedisminuye:16030,nuevosaldodeapripiacion:0,accion:1},
  ]

  displayedColumns: string[] = [
    'numrequire',
    'dependency',
    'description',
    'actividad',
    'pospre',
    'auxiliar',
    'mga',
    'fuente',
    'saldorequerimiento',
    'valorqueaumenta',
    'valorquedisminuye',
    'nuevosaldodeapripiacion',
    'accion',
  ];

  Columns: string[] = [
    'accion',
    'formato',
    'fotocopia'

  ];

  Date = [
    {formato:'formato XX-XXX-XX'},
    {fotocopia:'fotocopia CC'},
  ];

  pagesSize = 0;
  resultsLength = 0;



  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  saldorequerimiento=16.030;
  valorqueaumenta=16.030;
  valorquedisminuye=16.030;
  nuevosaldodeapripiacion=16.030;
  archivo ='';


  size = 2;
  pageIndex = 0;


  dataChecbox:any;


  constructor(

    private serviceProject:ProjectService,
    public router:  Router,
    private activeRoute: ActivatedRoute
    ){ }

  ngOnInit(): void {
  }


  getAllProjects(){
    this.serviceProject.getAllProjects().subscribe(data =>{
      console.log(data)
    })
  }


  requerimientos(contact: Data) {
    let route = '#';
    this.router.navigate([route], { queryParams: { id: contact.dependenciaOrigen} });
  }


  resumenejecucion(contact: Data) {
    let route = '#';
    this.router.navigate([route], { queryParams: { id: contact.id} });
  }


}
