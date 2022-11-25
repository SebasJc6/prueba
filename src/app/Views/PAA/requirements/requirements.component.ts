import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { dataTableRequerimentI, filterRequerimentI } from 'src/app/Models/ModelsPAA/Requeriment/Requeriment.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { RequerimentService } from 'src/app/Services/ServicesPAA/Requeriment/requeriment.service';

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
    private activeRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private serviceModRequest: ModificationRequestService,
    private spinner: NgxSpinnerService,) { }

  //Objeto con la informacion de acceso del Usuario
  AccessUser: string = '';

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

  //Propiedad con el es estado del proyecto
  ProjectState: string = '';

  ngOnInit(): void {
    this.filterRequertiments.page = "1";
    this.filterRequertiments.take = 20;
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';

    //Se obtiene el estado del Proyecto
    this.getStatusProject(Number(this.dataProjectID));

    this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);

    this.AccessUser = this.authService.getRolUser();
  }

  getStatusProject(projectId: number) {
    this.spinner.show();
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.ProjectState = data.data.proyecto_Estado;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterRequertiments.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterRequertiments.DependenciaDestino = this.filterForm.get('DependenciaDestino')?.value || '';
    this.filterRequertiments.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    this.filterRequertiments.columna = this.filterForm.get('columna')?.value || '';
    this.filterRequertiments.ascending = this.filterForm.get('ascending')?.value || false;

    this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);

    this.closeFilter();
  }

  //Limpiar el Filtro
  clearFilter() {
    this.filterForm.reset();
    
    this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);
    this.closeFilter();
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
    this.spinner.show();
    this.serviceRequeriment.getRequerimentsByProject(projectId, filterRequertiments).subscribe((data) => {
      this.viewRequeriments = data;
      this.dataSource = new MatTableDataSource(this.viewRequeriments.data.requerimientos.items);
      this.codProject = this.viewRequeriments.data.codigoProyecto;
      this.nomProject = this.viewRequeriments.data.nombre;
      this.numberPages = this.viewRequeriments.data.requerimientos.pages;
      this.numberPage = this.viewRequeriments.data.requerimientos.page;
      this.numberTake = filterRequertiments.take
      this.paginationForm.setValue({
        take: filterRequertiments.take,
        page: filterRequertiments.page
      });
      this.numberPagination = this.viewRequeriments.data.requerimientos.pages
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getPagination() {
    this.filterRequertiments.page = this.paginationForm.get('page')?.value;
    this.filterRequertiments.take = this.paginationForm.get('take')?.value;
    this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterRequertiments.page = this.numberPage.toString();
      this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);
    }
  }

  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterRequertiments.page = this.numberPage.toString();
      this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterRequertiments.page = this.numberPage.toString();
    this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterRequertiments.page = this.numberPage.toString();
    this.getRequerimentsByProject(Number(this.dataProjectID), this.filterRequertiments);
  }


  resumenejecucion(contact: any) {
    let route = '../abstract';
    this.router.navigate([route], { queryParams: { id: contact.numrequired } });
  }


  regresar() {
    this.router.navigate(['/WAPI/PAA/Adquisiciones']);
  }
  
  propertiesRequirement(requirementId: number) {
    this.router.navigate(['/WAPI/PAA/PropiedadesRequerimiento/' + this.dataProjectID + '/0/' + requirementId+ '/Vista']);
  }

  CDP(requirementId: number) {
    //this.router.navigate([`/WAPI/PAA/CDP/${this.dataProjectID}/${requirementId}`]);
  }

  StockOrders(requirementId: number) {
    //this.router.navigate([`/WAPI/PAA/StockOrders/${this.dataProjectID}/${requirementId}`]);
  }

  modificatioRequest() {
    this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/0' ]);
  }


  //Expresion regular para validar que solo se ingresen numeros en la paginación
  validateFormat(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[1-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }
}
