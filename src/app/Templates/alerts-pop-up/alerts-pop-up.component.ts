import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { getProjectReportsI, iDsProjectsReportPAAI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { dataReportsAllI } from 'src/app/Models/ModelsPAA/Reports/reports-interface';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { ReportsDetailsService } from 'src/app/Services/ServicesPAA/Reports/reports-details.service';

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
    private projectServices: ProjectService, 
    private reportServices: ReportsDetailsService) { dialogRef.disableClose = true; }

  
  Comentarios: string = '';


  //Select con checks para los proyectos
  PROJECTS = new FormControl();
  PROJECTS_LIST: getProjectReportsI[] = [];

  //Lista de reportes
  REPORTS_LIST: dataReportsAllI[] = [];

  //Numero de reporte seleccionado
  selectedValueValidity: number = 0;

  //Select con checks para los años de vigencias
  VALIDITYS= new FormControl();
  VALIDITYS_LIST: number[] = [];

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
      if (this.selectedValueValidity === 1) {
        let PROJECT_IDS : iDsProjectsReportPAAI = {
          'iDs': this.data.arrayData
        }

        this.getReportPAA(PROJECT_IDS);
      }
    }
    // console.log(this.selectedValueValidity);
    
  }


  //Obtener reporte PAA
  getReportPAA(project_ids:any){
    

    this.reportServices.postReportPAA(project_ids).subscribe(Response => {
      const REPORT_PAA = {
        reportType: 'PAA',
        data: Response
      }

      this.dialogRef.close(REPORT_PAA);
    }, error => {

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


  //Obtener los años de las vigencias
  getListValidity() {
    if (this.selectedValueValidity === 2) {
      this.projectServices.postProjectValidity(this.data.arrayData).subscribe(Response => {
        if (Response.status === 200) {
          this.VALIDITYS_LIST = Response.data;
        }
      }, error => {
        
      });
    }
  }
}
