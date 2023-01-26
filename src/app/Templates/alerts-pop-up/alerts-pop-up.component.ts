import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AlertData } from '../alerts/alerts.component';


@Component({
  selector: 'app-alerts-pop-up',
  templateUrl: './alerts-pop-up.component.html',
  styleUrls: ['./alerts-pop-up.component.scss']
})
export class AlertsPopUpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertsPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData) { dialogRef.disableClose = true; }

  
  Comentarios: string = '';
  
  ngOnInit(): void {
  }

  closeDialog(accion: number){
    const Revisiones: RevisionSend = {
      accion: accion,
      comentarios: this.Comentarios,
      idProject: 0,
      idSolicitud: 0
    }

    this.dialogRef.close(Revisiones);
  }
}
