import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';


export interface ImportBody {
  Observacion: string,
  File: any
}

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
  fileTmp: any;
  fileName: string = '';
  //Aqui guardamos el id de una solicitud creada por importación de un excel
  idSolicitudImport: string = '';

  //Justificación
  Justificacion: string = '';

  ngOnInit(): void {
  }


  importFile() {
    //
    const type = this.fileTmp.fileName.split('.').pop();
      if (type === 'xlsx') {
        if (this.Justificacion !== '') {
          
          let FILE = new FormData();
          FILE.append('File', this.fileTmp.file);
          FILE.append('Observacion', this.Justificacion);

          this.spinner.show();
          this.serviceModRequest.importFile(this.dataProjectID, FILE).subscribe(res => {

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
            this.dialogRef.close();
            this.spinner.hide();
          }, error => {
           let status = error.error.status;

           if (status == 422) {
             let message = error.error.message;
             let erorsMessages = '';
             if (error.error.data) {
               let errorData: string[] = Object.values(error.error.data);
               errorData.map(item => {
                 erorsMessages += item + '. ';
                });
              }
             this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
           } else if (status == 500) {
              this.openSnackBar('Lo sentimos', 'El documento Importado no cumple con los criterios de aceptación.', 'error');
           } else {
              this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
           }
            this.spinner.hide();
          });
        } else {
          this.openSnackBar('Error', `Debe agreagar una Justificación para Importar`, 'error');
        }
      } else {
        this.openSnackBar('Error', `Solo puede ingresar un archivo Excel`, 'error');
      }
  }


  getFile(event: any) {
    const file: FileList = event.target.files;
    let fil : File = file[0];

    if (file != null) {
      this.fileTmp = {
        file: fil,
        fileName: fil.name
      }
      
      const type = this.fileTmp.fileName.split('.').pop();
      if (type === 'xlsx') {
        this.fileName = this.fileTmp.fileName;
      }
      
    } else {
      this.openSnackBar('Error', `Solo puede ingresar un archivo Excel`, 'error');
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
