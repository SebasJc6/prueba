import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

export interface BTareas {
  date: string;
  codProject: string;
  numRequeriment: string;
  cantAjust: number;
}

const INFO_TAREAS: BTareas[] = [
  {date: '21-02-2022', codProject: '7750', numRequeriment: '001', cantAjust: 30},
  {date: '23-02-2022', codProject: '7750', numRequeriment: '002', cantAjust: 10},
  {date: '07-08-2022', codProject: '7824', numRequeriment: '001', cantAjust: 12},
];

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

  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['fecha', 'codProject', 'numRequeriment', 'cantAjust', 'requeriment'];
  dataSource = INFO_TAREAS;

  pageSizeOptions: number[] = [5, 10, 15, 20];
  numberPages: number = 0;
  numberPage: number = 0;

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) { }

  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  //CAMPOS PARA FILTRO
  filterForm = new FormGroup({
    Fecha: new FormControl(),
    CodProyecto: new FormControl(''),
    NumRequerimiento: new FormControl(''),
    CantAjustes: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });

  viewFilter: boolean = true;
  viewOrder = false;

  //AlertData
  type!: string;
  title!: string;
  message!: string;
  message2!: string;
  value!: string;

  ngOnInit(): void {

  }

  //PAGINACIÓN
  getPagination() {

  }

  nextPage() {

  }


  prevPage() {

  }

  firstPage() {

  }

  latestPage() {

  }

  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {

  }

   openSnackBar(title:string, message: string, type:string) {
     this.snackBar.openFromComponent(AlertsComponent, {
       data:{title,message,type},
       horizontalPosition: 'center',
       verticalPosition: 'top',
       panelClass: [type],
     });
   }

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

}
