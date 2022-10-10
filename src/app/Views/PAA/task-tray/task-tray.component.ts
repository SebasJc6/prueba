import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filterTaskTrayI, itemsTaskTrayI } from 'src/app/Models/ModelsPAA/task-tray/task-tray';
import { TaskTrayService } from 'src/app/Services/ServicesPAA/task-tray/task-tray.service';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

export interface AlertData {
  type: string;
  title: string;
  message: string;
  message2?: string;
  value?: string;
}

@Component({
  selector: 'app-task-tray',
  templateUrl: './task-tray.component.html',
  styleUrls: ['./task-tray.component.scss']
})
export class TaskTrayComponent implements OnInit {
  
  constructor(private snackBar: MatSnackBar, 
    public dialog: MatDialog, 
    private taskTrayService: TaskTrayService,
    public router: Router,) { }

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

    this.taskTrayService.getTaskTray(filterTaskTray).subscribe(request => {      
      console.log('rrequest',request)
      this.dataSource = request.data.items;
      this.numberPage = request.data.page;
      this.numberPages = request.data.pages;
      this.paginationForm.setValue({
        take: filterTaskTray.take,
        page: filterTaskTray.page
      });
    });
  }

  //Funcionalidad del botón Requerimiento
  chargeRequeriment(idRequeriment: number) {
    console.log(idRequeriment);
    
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

  //Metodo para llamar alertas
  //  openSnackBar(title:string, message: string, type:string) {
  //    this.snackBar.openFromComponent(AlertsComponent, {
  //      data:{title,message,type},
  //      horizontalPosition: 'center',
  //      verticalPosition: 'top',
  //      panelClass: [type],
  //    });
  //  }

  cargaAlert(){
    // this.openDialog('Advertencia', 'Ingrese los comentarios de su revisión', 'warningInput', 'Seleccione el estado de la modificación con su revisión.')

    // this.openSnackBar('Envío exitoso','Modificación reportada con exito', 'success');
    // this.openSnackBar('Lo sentimos','No se puede completar la operación porque faltan campos por ingresar. Te invitamos a completar la información para poder continuar.', 'error');
    // this.openSnackBar('Advertencia','Para generar el  reporte dirijase a la pantalla de gestion de PAA. ', 'warning');
  }

  // openDialog(title: string, message: string, type: string, message2: string): void {
  //   const dialogRef = this.dialog.open(AlertsPopUpComponent, {
  //     width: '1000px',
  //     height: '500px',
  //     data: {title: title, message: message, type: type, message2: message2},
  //   });

  //    dialogRef.afterClosed().subscribe(result => {
  //      console.log('The dialog was closed');
  //      this.value = result;
  //    });
  // }

  propertiesRequirement(numReq: number,projectId:number,solId:number) {
    this.router.navigate(['/PAA/PropiedadesRequerimiento/' + projectId + '/'+solId+'/' + numReq])
  }

}
