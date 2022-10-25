import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-pop-up-import',
  templateUrl: './pop-up-import.component.html',
  styleUrls: ['./pop-up-import.component.scss']
})
export class PopUpImportComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PopUpImportComponent>,
    public serviceModRequest: ModificationRequestService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) private dataProjectID: number,) { dialogRef.disableClose = true; }

  //Aqui se guarda el archivo a importar
  private fileTmp: any;

  //Aqui guardamos el id de una solicitud creada por importación de un excel
  idSolicitudImport: string = '';

  //Justificación
  Justificacion: string = '';

  ngOnInit(): void {
  }


  importFile() {

    this.dialogRef.close();
  }


  getFile(event: any) {
    const [file] = event.target.files;

    if (file != null) {
      this.fileTmp = {
        file: file,
        fileName: file.name
      }
      const type = this.fileTmp.fileName.split('.').pop();
      if (type === 'xlsx') {
        const body = {
          ProjectId: this.dataProjectID,
          Observacion: 'Observation'
        };
        const FILE = new FormData();
        FILE.append('file', this.fileTmp.file);


        this.spinner.show();
        this.serviceModRequest.importFile(body, FILE).subscribe(res => {
          let message = res.Message;
          let status = res.status;
          let Status = res.Status;
          let Data: string[] = [];


          if (status == 404) {
            Data = Object.values(res.Data);
          } else if (status == 200) {
            this.idSolicitudImport = res.data.idSolicitud;
          } else if (Status == 404) {
            Data = Object.values(res.Data);
          }

          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });

          if (status == 404) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          } else if (status == 200) {
            this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Guardada.`, 'success');
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          } else if (Status == 404) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          } else if (Status == 200) {
            this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Guardada.`, 'success');
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          }
          this.spinner.hide();
        }, error => {
          let status = error.error.Status;
          let message = error.error.Message;
          let errorData: string[] = Object.values(error.error.Data);
          let erorsMessages = '';
          errorData.map(item => {
            erorsMessages += item + '. ';
          });

          if (status == 422) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          }
          this.spinner.hide();
        });
      }
    }
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
