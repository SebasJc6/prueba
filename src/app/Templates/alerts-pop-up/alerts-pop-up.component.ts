import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { dateTimeCausalModificationReportI, getProjectReportsI, iDsAndAniosProjectsReportPAAI, iDsProjectsReportI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { dataReportsAllI } from 'src/app/Models/ModelsPAA/Reports/reports-interface';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { ReportsDetailsService } from 'src/app/Services/ServicesPAA/Reports/reports-details.service';
import { AlertsComponent } from '../alerts/alerts.component';

export interface AlertDataPopUp {
  type: string;
  title: string;
  message: string;
  arrayData: number[];
  message2?: string;
  dataType?: string;
}

@Component({
  selector: 'app-alerts-pop-up',
  templateUrl: './alerts-pop-up.component.html',
  styleUrls: ['./alerts-pop-up.component.scss']
})
export class AlertsPopUpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertsPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDataPopUp, 
    private projectServices: ProjectService, private snackBar: MatSnackBar,
    private reportServices: ReportsDetailsService) { dialogRef.disableClose = true; }

  
  Comentarios: string = '';


  //Select con checks para los proyectos
  PROJECTS = new FormControl();
  PROJECTS_LIST: getProjectReportsI[] = [];

  //Lista de reportes
  REPORTS_LIST: dataReportsAllI[] = [];

  //Numero de reporte seleccionado
  selectedValueReport: number = 0;

  //Select con checks para los años de vigencias
  VALIDITYS= new FormControl();
  VALIDITYS_LIST: number[] = [];

  //Obtener fechas inicio y fin para el reporte Causales de Modificación
  DateForm = new FormGroup({
    dateInitial : new FormControl(new Date()),
    dateFinal : new FormControl(new Date())
  });

  ngOnInit(): void {
    if (this.data.dataType === 'proyectos') {
      this.getProjectsInfo();
    }
    else if (this.data.dataType === 'reportes') {
      this.getListReports();
    }
  }

  closeDialog(action: number){
    if (action === 1 || action === 2 || action === 3) {
      const Revisiones: RevisionSend = {
        accion: action,
        comentarios: this.Comentarios,
        idProject: 0,
        idSolicitud: 0
      }
  
      this.dialogRef.close(Revisiones);
    }
    else if (action === 5) {
      if (this.selectedValueReport === 1) {
        let PROJECT_IDS : iDsProjectsReportI = {
          'iDs': this.data.arrayData
        }

        this.getReportPAA(PROJECT_IDS);
      } 
      else if (this.selectedValueReport === 2) {
        let REPORT_INFO : iDsAndAniosProjectsReportPAAI = {
          'iDs' : this.data.arrayData,
          'anios' : this.VALIDITYS.value
        }
        
        this.getReportREP(REPORT_INFO);
      } 
      else if (this.selectedValueReport === 4) {
        this.dialogRef.close();
        this.openSnackBar('Advertencia', `Para generar el reporte seleccione una solicitud de modificación`, 'warning', 'BandejaDeSolicitudes');
      }
      else if (this.data.message2 === '8') {
        const FECHA_INICIO = String(this.DateForm.value.dateInitial);
        const FECHA_FIN = String(this.DateForm.value.dateFinal);
        if (FECHA_INICIO && FECHA_FIN) {
          if(Date.parse(FECHA_FIN) <= Date.parse(FECHA_INICIO)){
            this.openSnackBar('Error', `La fecha fin debe ser mayor a la fecha inicio`, 'error', '');
          }else{
            this.getReportCausalModification(FECHA_INICIO, FECHA_FIN);
          }
        } else {
          this.openSnackBar('Error', `Debe seleccionar una fecha inicio y una fecha fin para generar el reporte`, 'error', '');
        }
      }
    }
    else if (action === 6) {
      const ARRAY_PROJECTS_SELECTED: any[] = this.PROJECTS.value;

      if (this.PROJECTS.value) {

        let ID_PROJECTS = ARRAY_PROJECTS_SELECTED.map(element => {
          return element.proyecto_ID;
        });

        const PROJECTS_ID : iDsProjectsReportI = {
          'iDs' : ID_PROJECTS
        }

        if (this.data.message2 === '3') {
          this.getReportModifications(PROJECTS_ID);
        }
        else if (this.data.message2 === '5') {
          this.getReportActionPlan(PROJECTS_ID);
        }
        else if (this.data.message2 === '6') {
          this.getReportCDP(PROJECTS_ID);
        }
        else if (this.data.message2 === '7') {
          this.getReportRP(PROJECTS_ID);
        }
        else if (this.data.message2 === '9') {
          this.getReportOrders(PROJECTS_ID);
        }
      }
    }
    
    // console.log(this.selectedValueReport);
    // console.log(this.data.message2);
  }


  //Obtener reporte PAA
  getReportPAA(project_ids : iDsProjectsReportI){
    this.reportServices.postReportPAA(project_ids).subscribe(Response => {
      const REPORT_PAA = {
        reportType: '1_PAA',
        data: Response
      }

      this.dialogRef.close(REPORT_PAA);
    }, error => {
      
    });
  }


  //Obtener reporte Resumen de Ejecución Presupuestal (REP)
  getReportREP(report_info : iDsAndAniosProjectsReportPAAI) {
    this.reportServices.postReportREP(report_info).subscribe(Response => {
      const REPORT_REP = {
        reportType: '2_REP',
        data: Response
      }

      this.dialogRef.close(REPORT_REP);
    }, error => {

    })
  }


  //Obtener reporte de Modificaciones
  getReportModifications(project_ids : iDsProjectsReportI) {
    this.reportServices.postReportModifications(project_ids).subscribe((Response:any) => {
      // console.log(Response);
      if (Response.status === 200) {
        this.openSnackBar('Exportado Exitosamente', `El archivo "${Response.data.fileName}" fué generado correctamente.`, 'success');
        this.convertBase64ToFileDownload(Response.data.fileAsBase64, Response.data.fileName);
      } else if (Response.status === 423) {
        this.openSnackBar('Lo sentimos', Response.message, 'error', `Generando archivo de errores "${Response.data.FileName}".`);
        this.convertBase64ToFileDownload(Response.data.FileAsBase64, Response.data.FileName);
      }
      // TODO: Validar error 422
      else {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      }

      this.dialogRef.close();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }


  //Obtener reporte Plan de Accion (5)
  getReportActionPlan(project_ids : iDsProjectsReportI) {
    this.reportServices.postReportActionPlan(project_ids).subscribe((Response:any) => {
      // console.log(Response);
      if (Response.status === 200) {
        this.openSnackBar('Exportado Exitosamente', `El archivo "${Response.data.fileName}" fué generado correctamente.`, 'success');
        this.convertBase64ToFileDownload(Response.data.fileAsBase64, Response.data.fileName);
      } else if (Response.status === 423) {
        this.openSnackBar('Lo sentimos', Response.message, 'error', `Generando archivo de errores "${Response.data.FileName}".`);
        this.convertBase64ToFileDownload(Response.data.FileAsBase64, Response.data.FileName);
      }
      else {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      }

      this.dialogRef.close();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }


  //Obtener reporte CDP (6)
  getReportCDP(project_ids : iDsProjectsReportI) {
    this.reportServices.postReportCDPs(project_ids).subscribe((Response:any) => {
      // console.log(Response);
      if (Response.status === 200) {
        this.openSnackBar('Exportado Exitosamente', `El archivo "${Response.data.fileName}" fué generado correctamente.`, 'success');
        this.convertBase64ToFileDownload(Response.data.fileAsBase64, Response.data.fileName);
      } else if (Response.status === 423) {
        this.openSnackBar('Lo sentimos', Response.message, 'error', `Generando archivo de errores "${Response.data.FileName}".`);
        this.convertBase64ToFileDownload(Response.data.FileAsBase64, Response.data.FileName);
      }
      else {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      }

      this.dialogRef.close();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }


  //Obtener reporte RP (7)
  getReportRP(project_ids : iDsProjectsReportI) {
    this.reportServices.postReportRPs(project_ids).subscribe((Response:any) => {
      // console.log(Response);
      if (Response.status === 200) {
        this.openSnackBar('Exportado Exitosamente', `El archivo "${Response.data.fileName}" fué generado correctamente.`, 'success');
        this.convertBase64ToFileDownload(Response.data.fileAsBase64, Response.data.fileName);
      } else if (Response.status === 423) {
        this.openSnackBar('Lo sentimos', Response.message, 'error', `Generando archivo de errores "${Response.data.FileName}".`);
        this.convertBase64ToFileDownload(Response.data.FileAsBase64, Response.data.FileName);
      }
      else {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      }

      this.dialogRef.close();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }



  //Obtener reporte Giros (9)
  getReportOrders(project_ids : iDsProjectsReportI) {
    this.reportServices.postReportOrders(project_ids).subscribe((Response:any) => {
      // console.log(Response);
      if (Response.status === 200) {
        this.openSnackBar('Exportado Exitosamente', `El archivo "${Response.data.fileName}" fué generado correctamente.`, 'success');
        this.convertBase64ToFileDownload(Response.data.fileAsBase64, Response.data.fileName);
      } else if (Response.status === 423) {
        this.openSnackBar('Lo sentimos', Response.message, 'error', `Generando archivo de errores "${Response.data.FileName}".`);
        this.convertBase64ToFileDownload(Response.data.FileAsBase64, Response.data.FileName);
      }
      else {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      }

      this.dialogRef.close();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }


  //Obtener reporte Causales de Modificacion (8)
  getReportCausalModification(date_initial : string, date_final : string) {
    //Constante con las fechas inicial y final para enviar al endpoint
    const DATE_TIMES : dateTimeCausalModificationReportI = {
      rangoFechaFin : new Date(date_final).toISOString().split('T')[0],
      rangoFechaInicio : new Date(date_initial).toISOString().split('T')[0]
    }
    
    this.reportServices.postReportCausalModification(DATE_TIMES).subscribe((Response:any) => {
      // console.log(Response);
      if (Response.status === 200) {
        this.openSnackBar('Exportado Exitosamente', `El archivo "${Response.data.fileName}" fué generado correctamente.`, 'success');
        this.convertBase64ToFileDownload(Response.data.fileAsBase64, Response.data.fileName);
      } else {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      }

      this.dialogRef.close();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }


  //Obtener los codigos de los proyectos
  getProjectsInfo() {
    this.projectServices.getProjectsMini().subscribe(Response => {
      if (Response.status === 200) {
        this.PROJECTS_LIST = Response.data;
      }
    }, error => {
      
    });
  }


  //Obtener lista de los reportes a exportar
  getListReports() {
    this.reportServices.getReportsAll().subscribe(Response => {
      if (Response.status === 200) {
        this.REPORTS_LIST = Response.data;
      }
    }, error => {
      
    });
  }


  //Obtener los años para las Vigencias
  getListValidity() {
    if (this.selectedValueReport === 2) {
      this.projectServices.postProjectValidity(this.data.arrayData).subscribe(Response => {
        if (Response.status === 200) {
          this.VALIDITYS_LIST = Response.data;
        }
      }, error => {
        
      });
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
