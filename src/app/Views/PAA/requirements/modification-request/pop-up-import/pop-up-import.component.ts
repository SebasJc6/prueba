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
          
          // let blob = new Blob([this.fileTmp.file], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

          let FILE = new FormData();
          FILE.append('File', this.fileTmp.file);
          
          // console.log(this.fileTmp);
          let File = this.fileTmp.file;
          const body: any = {
            Observacion: this.Justificacion,
            File: FILE
          };

          console.log(FILE);
          
          this.spinner.show();
          this.serviceModRequest.importFile(this.dataProjectID, body).subscribe(res => {

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
            console.log(error);
            
           let status = error.error.status;

           if (status == 422) {
             let message = error.error.message;
             let errorData: string[] = Object.values(error.error.data);
             let erorsMessages = '';
             errorData.map(item => {
               erorsMessages += item + '. ';
             });
             this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
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
