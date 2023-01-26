import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dataReportsAllI } from 'src/app/Models/ModelsPAA/Reports/reports-interface';
import { ReportsDetailsService } from 'src/app/Services/ServicesPAA/Reports/reports-details.service';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private reportsDetailsServices: ReportsDetailsService,
              public dialog: MatDialog, private snackBar: MatSnackBar, ) { }
    
  REPORTS_DETAILS: dataReportsAllI[] = [];

  ngOnInit(): void {
    this.getReportsAll();
  }

  getReportsAll() {
    this.reportsDetailsServices.getReportsAll().subscribe(Response => {            
      this.REPORTS_DETAILS = Response.data;
    }, error => {

    });
  }


  onClickCard(numero_reporte : number) {
    console.log(numero_reporte);
    if (numero_reporte === 1 || numero_reporte === 2) {
      this.openSnackBar('Advertencia', `Para generar el reporte dirijase a la pantalla de gestión de PAA`, 'warning', 'Adquisiciones');
    } 
    else if (numero_reporte === 4) {
      this.openSnackBar('Advertencia', `Para generar el reporte seleccione una solicitud de modificación`, 'warning', 'BandejaDeSolicitudes');
    }
    else if (numero_reporte === 3 || numero_reporte === 5 || numero_reporte === 6 || numero_reporte === 7 || numero_reporte === 8 || numero_reporte === 9 || numero_reporte === 10) {
      this.openDialog('Advertencia', 'Seleccione uno o varios proyectos', 'warningSelectProjects', '', 'proyectos');
    }
  }


  //Alerta PopUp
  openDialog(title: string, message: string, type: string, message2: string, dataType: string, arrayData?: number[]): void {
    const dialogRef = this.dialog.open(AlertsPopUpComponent, {
      width: '450px',
      height: '500px',
      data: { title: title, message: message, type: type, message2: message2, dataType: dataType, arrayData: arrayData },
    });
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

}
