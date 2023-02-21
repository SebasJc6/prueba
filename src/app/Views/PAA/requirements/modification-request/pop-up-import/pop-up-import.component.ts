import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    public router: Router,
    @Inject(MAT_DIALOG_DATA) private dataImport: any,) { dialogRef.disableClose = true; }

  //Aqui se guarda el archivo a importar
  fileTmp: any;
  fileName: string = '';
  //Aqui guardamos el id de una solicitud creada por importación de un excel
  idSolicitudImport: string = '';

  //Justificación
  Justificacion: string = '';

  //Id del proyecto
  id_project: number = 0;
  //Id de la solicitud
  id_request: number = 0;

  ngOnInit(): void {
    this.id_project = Number(this.dataImport.id_project);
    this.id_request = Number(this.dataImport.id_request);
    
    if (this.id_request != 0) {
      this.Justificacion = this.dataImport.justify;
    }
  }


  importFile() {
    if (this.fileTmp !== undefined) {
      let FILE = new FormData();
      FILE.append('File', this.fileTmp.file);
      FILE.append('Observacion', this.Justificacion);

      //Verificar que la Solicitud de Modificación no exista
      if (this.id_request === 0) {
        this.serviceModRequest.importFile(this.id_project, FILE).subscribe(res => {

          let message = res.message;
          let status = res.status;
          let Data: string[] = [];

          if (status == 404) {
            if (res.data != null) {
              Data = Object.values(res.data);
            }
          } else if (status == 200) {
            this.idSolicitudImport = res.data.idSolicitud;
          }

          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });

          if (status == 404) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          } else if (status == 200) {
            this.openSnackBar('Guardado Exitosamente', `Solicitud de modificación guardada con éxito.`, 'success');
            this.dialogRef.close();
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          }

            this.dialogRef.close();
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
          this.dialogRef.close();
        });

      } else if (this.id_request !== 0) {
        //Se ejecuta el endpoint de actualizar import
        this.serviceModRequest.importFilePut(this.id_project, this.id_request, FILE).subscribe(res => {

          let message = res.message;
          let status = res.status;
          let Data: string[] = [];

          if (status == 404) {
            if (res.data != null) {
              Data = Object.values(res.data);
            }
          }

          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });

          if (status == 404) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          } else if (status == 200) {
            this.openSnackBar('Guardado Exitosamente', `Solicitud de modificación actualizada y guardada con éxito.`, 'success');
          } else if (status === 423) {
            this.openSnackBar('Lo sentimos', res.message, 'error', `Generando archivo de errores "${res.data.FileName}".`);
            this.convertBase64ToFileDownload(res.data.FileAsBase64, res.data.FileName);
          } 
          this.dialogRef.close();
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
          this.dialogRef.close();
        });

      }

    } else {
      this.openSnackBar('Error', `Debe agreagar un archivo excel para importar.`, 'error');
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
      } else {
        this.openSnackBar('Error', `Solo puede ingresar un archivo Excel`, 'error');
      }
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
