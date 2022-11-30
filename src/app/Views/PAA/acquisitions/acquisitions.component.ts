import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { dataTableProjectI, filterProjectI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CDPService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/cdp.service';

export interface ChipColor {
  name: string;
  color: ThemePalette;
}

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

  //Formulario de filtro
  viewOrder = false;
  estadoFilter: string[] = ['Todos', 'Aprobado', 'Cerrado', 'En Ejecución', 'Anteproyecto']

  // dataSource = new MatTableDataSource<dataTableProjectI>(ELEMENT_DATA);
  dataSource!: MatTableDataSource<dataTableProjectI>;
  selection = new SelectionModel<dataTableProjectI>(true, []);
  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  viewFilter: boolean = true;
  numberPages: number = 0;
  numberPage: number = 0;
  numberTake: number = 0;

  constructor(
    private serviceProject: ProjectService, 
    public router: Router, private authService: AuthenticationService,
    private serviceCdps: CDPService,
    private spinner: NgxSpinnerService,) {

  }
  filterProjects = {} as filterProjectI;
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  filterForm = new FormGroup({
    DependenciaOrigen: new FormControl(''),
    CodigoProyecto: new FormControl(),
    Nombre: new FormControl(''),
    EstadoDesc: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  })

  //Objeto con la informacion de acceso del Usuario
  AccessUser: string = '';

  
  ngOnInit(): void {
    this.ngAfterViewInit();
    
    this.filterProjects.page = "1";
    this.filterProjects.take = 20;
    this.getAllProjects(this.filterProjects);
    
    this.AccessUser = this.authService.getRolUser();
  }
  

  ngAfterViewInit() {
    if (this.isApproved === true) {
      this.tooltip = 'Ejecutar'
    } else if(this.isApproved === false){
      this.tooltip = 'Aprobar'
    }
  }

  
  getAllProjects(filterProjects: filterProjectI) {
    if (this.filterForm.value.EstadoDesc == 'Todos') {
      this.filterProjects.EstadoDesc =  ' ';
    }else{
    this.filterProjects.EstadoDesc = this.filterForm.get('EstadoDesc')?.value || '' ;
    }

    this.filterProjects.DependenciaOrigen = this.filterForm.get('DependenciaOrigen')?.value || '';
    this.filterProjects.CodigoProyecto = this.filterForm.value.CodigoProyecto || '';
    this.filterProjects.Nombre = this.filterForm.get('Nombre')?.value || '';
    this.filterProjects.columna = this.filterForm.get('columna')?.value || '';
    this.filterProjects.ascending = this.filterForm.get('ascending')?.value || false;

    this.spinner.show();
    this.serviceProject.getAllProjectsFilter(filterProjects).subscribe(data => {
      this.viewProjects = data
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

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


  //Funcion para convertir un archivo a Base 64
  extraerBase64 = async ($event: any) => new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          nameFile: $event.name,
          base: reader.result?.toString().split(',')[1]
        });
      };
      reader.onerror = error => {
        resolve({
          base: error
        });
      };
    } catch (e) {
      return e;
    }
  });


  //Obtener archivo y pasarlo a Base64
  onFileSelected(event: any) {
    const file: FileList = event.target.files;
    let fil : File = file[0];

    if (file != null) {
        this.importFileBase64(fil);
    }
  }


  //Importar Documento de CDPs/RPs
  importFileBase64(file : any) {
    this.serviceCdps.postCDPs(file).subscribe(response => {
      console.log('Res: ', response);
      
    }, error => {
      console.log('Error: ', error);
      
    });
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
    this.filterProjects.page = this.paginationForm.get('page')?.value;;
    this.filterProjects.take = this.paginationForm.get('take')?.value;
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

  //Filtro
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterProjects.DependenciaOrigen = this.filterForm.get('DependenciaOrigen')?.value || '';
    this.filterProjects.CodigoProyecto = this.filterForm.value.CodigoProyecto || '';
    this.filterProjects.Nombre = this.filterForm.get('Nombre')?.value || '';
    this.filterProjects.columna = this.filterForm.get('columna')?.value || '';
    this.filterProjects.ascending = this.filterForm.get('ascending')?.value || false;

    this.getAllProjects(this.filterProjects);

    this.closeFilter();
  }

  //Limpiar el Filtro
  clearFilter() {
    this.filterForm.reset();
    
    this.getAllProjects(this.filterProjects);
    this.closeFilter();
  }

  openRequeriment(proyectoID: number) {
    this.router.navigate(['/WAPI/PAA/Requerimientos', proyectoID])
  }
  openAbstract(proyectoID: number) {
    this.router.navigate(['/WAPI/PAA/Resumen', proyectoID])
  }
  changeExecution(proyectoID: number) {   
    this.serviceProject.patchExecutionProject(proyectoID).subscribe(data => {
      this.getAllProjects(this.filterProjects);
      this.isApproved = true;
    })
  }
  changeStatus(proyectoID: number) {   
    this.serviceProject.patchStatusProject(proyectoID).subscribe(data => {
      this.getAllProjects(this.filterProjects);
      this.isApproved = true;
    })
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
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }

}
