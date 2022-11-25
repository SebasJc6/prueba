import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { filterTaskTrayI, itemsTaskTrayI } from 'src/app/Models/ModelsPAA/task-tray/task-tray';
import { TaskTrayService } from 'src/app/Services/ServicesPAA/task-tray/task-tray.service';


@Component({
  selector: 'app-task-tray',
  templateUrl: './task-tray.component.html',
  styleUrls: ['./task-tray.component.scss']
})
export class TaskTrayComponent implements OnInit {
  
  constructor(private snackBar: MatSnackBar, 
    public dialog: MatDialog, 
    private taskTrayService: TaskTrayService,
    public router: Router,
    private spinner: NgxSpinnerService,) { }

  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['fecha', 'codProject', 'numRequeriment', 'cantAjust', 'requeriment'];
  dataSource: itemsTaskTrayI[] = [];

  //CAMPOS PARA FILTRO
  filterTaskTray = {} as filterTaskTrayI;

  filterForm = new FormGroup({
    Fecha: new FormControl(),
    CodigoProyecto: new FormControl(),
    NumeroRequerimiento: new FormControl(),
    CantidadAjustes: new FormControl(),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });

  //Paginacion
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  numberPages: number = 0;
  numberPage: number = 0;

  //Variables para abir y cerrar la opción de filtro
  viewFilter: boolean = true;
  viewOrder = false;

  ngOnInit(): void {
    this.filterTaskTray.page = "1";
    this.filterTaskTray.take = 20;

    this.getTaskTray(this.filterTaskTray);
  }

  //Funcion para ontener la información del endpoint BandejaTareas
  getTaskTray(filterTaskTray: filterTaskTrayI) {
    this.filterTaskTray.Fecha = this.filterForm.get('Fecha')?.value || '';
    this.filterTaskTray.CodigoProyecto = this.filterForm.value.CodigoProyecto || '';
    this.filterTaskTray.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterTaskTray.CantidadAjustes = this.filterForm.value.CantidadAjustes || '';
    this.filterTaskTray.columna = this.filterForm.get('columna')?.value || '';
    this.filterTaskTray.ascending = this.filterForm.get('ascending')?.value || false;

    this.spinner.show();
    this.taskTrayService.getTaskTray(filterTaskTray).subscribe(request => {      
      this.dataSource = request.data.items;
      this.numberPage = request.data.page;
      this.numberPages = request.data.pages;
      this.paginationForm.setValue({
        take: filterTaskTray.take,
        page: filterTaskTray.page
      });
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  
  //FILTRO
  openFilter() {
    this.viewFilter = false;
  }
  closeFilter() {
    this.viewFilter = true;
  }

  getFilter() {
    this.filterTaskTray.Fecha = this.filterForm.get('Fecha')?.value || '';
    this.filterTaskTray.CodigoProyecto = this.filterForm.value.CodigoProyecto || '';
    this.filterTaskTray.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterTaskTray.CantidadAjustes = this.filterForm.value.CantidadAjustes || '';
    this.filterTaskTray.columna = this.filterForm.get('columna')?.value || '';
    this.filterTaskTray.ascending = this.filterForm.get('ascending')?.value || false;

    this.getTaskTray(this.filterTaskTray);

    this.closeFilter();
  }

    //Limpiar el Filtro
    clearFilter() {
      this.filterForm.reset();
      
      this.getTaskTray(this.filterTaskTray);
      this.closeFilter();
    }

  //PAGINACIÓN
  getPagination() {
    this.filterTaskTray.page = this.paginationForm.get('page')?.value;
    this.filterTaskTray.take = this.paginationForm.get('take')?.value;
    this.getTaskTray(this.filterTaskTray);
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterTaskTray.page = this.numberPage.toString();
      this.getTaskTray(this.filterTaskTray);
    }
  }
  
  
  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterTaskTray.page = this.numberPage.toString();
      this.getTaskTray(this.filterTaskTray);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterTaskTray.page = this.numberPage.toString();
    this.getTaskTray(this.filterTaskTray);
  }

  latestPage() {
    this.numberPage = this.numberPages;
    this.filterTaskTray.page = this.numberPage.toString();
    this.getTaskTray(this.filterTaskTray);
  }
  
  //Funcionalidad del botón Requerimiento
  propertiesRequirement(numReq: number,projectId:number,solId:number) {
    this.router.navigate(['/WAPI/PAA/PropiedadesRequerimiento/' + projectId + '/'+solId+'/' + numReq+ '/Ajuste'])
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
