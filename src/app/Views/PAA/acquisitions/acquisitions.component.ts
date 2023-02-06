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
import { CDPService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/cdp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import { StockOrdersService } from 'src/app/Services/ServicesPAA/Requeriment/Stock-Orders/stock-orders.service';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

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
    private serviceStockOrders: StockOrdersService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {

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

  //Propiedad para reiniciar el input Importar CDPs/RPs y cargar el mismo archivo varias veces
  fileCDPsRPs: string = '';

  //Propiedad para reiniciar el input de archivos
  inputFile: string = '';


  //Checks
  projectsChecked: dataTableProjectI[] = [];
  selection = new SelectionModel<dataTableProjectI>(true, []);

  
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

    }, error => {
    });
  }


  //CHECKs
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

  checkboxLabel(row?: dataTableProjectI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }


  //Obtener archivo CDPs/RPs
  onFileSelected(event: any) {
    const file: FileList = event.target.files;
    let fil : File = file[0];
    this.fileCDPsRPs = '';
    if (file != null) {
      let FILE = new FormData();
      FILE.append('file', fil);

      this.importFile(FILE);
    }
  }

  //Convertir archivo de Base64 a .xlsx y descargarlo
  convertBase64ToFileDownload(base64String: string, fileName: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}`;
    link.click();
  }


  //Importar Documento de CDPs/RPs
  importFile(file : any) {
    this.serviceCdps.postCDPs(file).subscribe(response => {
      
      if (response.status === 200) {
        if (response.data.hasWarnings) {
          this.openSnackBar('Advertencia', `Se guardaron los registros y surgieron advertencias. Descargando archivo de advertencias ${response.data.warnings.fileName}`, 'warning');
          this.convertBase64ToFileDownload(response.data.warnings.fileAsBase64, response.data.warnings.fileName);
        } else {
          this.openSnackBar('Guardado Exitosamente', `CDPs/RPs importados con éxito.`, 'success');
        }
      } else if(response.status === 422) {
        this.openSnackBar('Lo sentimos', response.message, 'error', `Descargando archivo de errores "${response.data.FileName}".`);
        this.convertBase64ToFileDownload(response.data.FileAsBase64, response.data.FileName);
      } else if (response.status === 423) {
        this.openSnackBar('Lo sentimos', response.message, 'error', `Descargando archivo de errores "${response.data.FileName}".`);
        this.convertBase64ToFileDownload(response.data.FileAsBase64, response.data.FileName);
      }
    }, error => {
      // console.log('Error: ', error);
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }


  //Obtener archivo Giros
  onFileStockOrders(event: any) {
    const file: FileList = event.target.files;
    let fil : File = file[0];
    this.inputFile = '';
    if (file != null) {
      let FILE = new FormData();
      FILE.append('file', fil);

      this.importFileStockOrders(FILE);
    }
  }


  //Exportar excel proyectos
  exportExcelProjects() {
    this.projectsChecked = this.selection.selected;
    let arrayProjects: number[] = this.projectsChecked.map(element => {
      return element.proyectoID;
    });

    this.openDialog('Advertencia', 'Seleccione el reporte que desea exportar', 'warningSelectReports', '', 'reportes', arrayProjects);
  }


  //Importar Documento de CDPs/RPs
  importFileStockOrders(file : any) {
    this.serviceStockOrders.postStockOrders(file).subscribe(response => {
      
      if (response.status === 200) {
        if (response.data.hasWarnings) {
          this.openSnackBar('Advertencia', `Se guardaron los registros y surgieron advertencias. Generando archivo de advertencias ${response.data.warnings.fileName}`, 'warning');
          this.convertBase64ToFileDownload(response.data.warnings.fileAsBase64, response.data.warnings.fileName);
        } else {
          this.openSnackBar('Guardado Exitosamente', `Giros importados con éxito.`, 'success');
        }
      } else if(response.status === 422) {
        this.openSnackBar('Lo sentimos', response.message, 'error', `Generando archivo de errores "${response.data.FileName}".`);
        this.convertBase64ToFileDownload(response.data.FileAsBase64, response.data.FileName);
      } else if (response.status === 423) {
        this.openSnackBar('Lo sentimos', response.message, 'error', `Generando archivo de errores "${response.data.FileName}".`);
        this.convertBase64ToFileDownload(response.data.FileAsBase64, response.data.FileName);
      }
    }, error => {
      // console.log('Error: ', error);
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }



  //Alerta PopUp Reportes
  openDialog(title: string, message: string, type: string, message2: string, dataType: string, arrayData?: number[]): void {
    const dialogRef = this.dialog.open(AlertsPopUpComponent, {
      width: '450px',
      height: '500px',
      data: { title: title, message: message, type: type, message2: message2, dataType: dataType, arrayData: arrayData },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.reportType ==='1_PAA' || result.reportType ==='2_REP') {
          if (result.data.status === 200) {
            this.openSnackBar('Exportado Exitosamente', `El archivo "${result.data.data.fileName}" fué generado correctamente.`, 'success');
            this.convertBase64ToFileDownload(result.data.data.fileAsBase64, result.data.data.fileName);
          } else if (result.data.status === 423) {
            this.openSnackBar('Lo sentimos', result.data.message, 'error', `Generando archivo de errores "${result.data.data.FileName}".`);
            this.convertBase64ToFileDownload(result.data.data.FileAsBase64, result.data.data.FileName);
          }
          else {
            this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
          }
        }
      }

    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
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


  //Metodo para llamar alertas
  openSnackBar(title: string, message: string, type: string, message2?: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data: { title, message, message2, type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
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
