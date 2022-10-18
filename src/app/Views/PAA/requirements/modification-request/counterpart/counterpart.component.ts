
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CounterpartInterface, editCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { dateTableModificationI, postModificRequestCounterpartI, putModificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { CounterpartService } from 'src/app/Services/ServicesPAA/modificationRequest/counterpart/counterpart.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-counterpart',
  templateUrl: './counterpart.component.html',
  styleUrls: ['./counterpart.component.scss']
})
export class CounterpartComponent implements OnInit {

  constructor( public serviceCounterpar: CounterpartService,
    public router: Router,
    private snackBar: MatSnackBar,
    public serviceModRequest: ModificationRequestService,
    public dialogRef: MatDialogRef<CounterpartComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCounterparts: any,) 
    { dialogRef.disableClose = true;}

  //Arreglo que guarda la información del proyecto para mostrar en la lista desplegable
  states: CounterpartInterface[] = [];

  Source = {} as CounterpartInterface;
  SourcesGet: any[] = [];
  ArraySources: CounterpartInterface[] = [];

  CounterEdit = {} as editCounterpartI;
  ModificationId: number = 0;

  counterpartForm = new FormGroup({
    fuentes: new FormControl(),
    Descripcion: new FormControl(''),
    ValorAumenta: new FormControl(),
    ValorDisminuye: new FormControl()
  });

  private counterpartSubscription!: Subscription;

  counterpart = {} as postModificRequestCounterpartI;

  ngOnInit(): void {
    this.getCounterpartF(this.dataCounterparts.id_request);
    this.getSourcesTemporal();
    this.cargarDataEdit();
    
  }

  //Función que trae la información del proyecto de la Api
  getCounterpartF(idRequest: string) {
    this.counterpartSubscription = this.serviceCounterpar.getCounterpartFRequest(idRequest).subscribe(request => {
      this.states = request.data;
    });
  }

  getSourcesTemporal() {
    let fromStorage: any = ProChartStorage.getItem(`arrayIdSources${this.dataCounterparts.id_request}`);
    let listIdSource: string[] = [];
    let objectsFromStorage: string[] = []
    
    if (fromStorage !== null) {
      objectsFromStorage = JSON.parse(fromStorage || '');
      listIdSource = objectsFromStorage.filter((item, index) => {
        return objectsFromStorage.indexOf(item) === index;
      });
      if (objectsFromStorage.length > 0) {
        this.counterpartSubscription = this.serviceCounterpar.postFuentesGetList(listIdSource).subscribe(res => {
          this.SourcesGet = res.data;
          //console.log(res);
        });

        //TODO: Revisar esta parte
        this.SourcesGet.map(item => {
          this.Source.descripcion = item.descripcion;
          this.Source.fuente_ID = item.fuente_ID;
          //this.Source. = 0;
    
          this.ArraySources.push(this.Source);
          return this.ArraySources;
        });
      }
      
      //console.log(this.ArraySources);
    }
    //this.states.concat(this.ArraySources);
    
    //console.log(this.states);
    
  }

  cargarDataEdit() {
    let CounterFromStorage = ProChartStorage.getItem(`CounterpartEdit${this.dataCounterparts.id_request}`);
    
    if (CounterFromStorage?.length != 0 && CounterFromStorage !== null) {
      this.CounterEdit = JSON.parse(CounterFromStorage || '');
      this.ModificationId = this.CounterEdit.modificacion_ID;
      this.counterpartForm.controls['fuentes'].setValue(this.CounterEdit.contrapartida.fuente_ID);
      this.counterpartForm.controls['Descripcion'].setValue(this.CounterEdit.contrapartida.descripcion);
      this.counterpartForm.controls['ValorAumenta'].setValue(this.CounterEdit.contrapartida.valorAumenta);
      this.counterpartForm.controls['ValorDisminuye'].setValue(this.CounterEdit.contrapartida.valorDisminuye);

    }
  }

  closedDialog(){
    if (this.counterpartForm.value.fuentes){
      if (this.ModificationId != 0) {
        this.CounterEdit.contrapartida.fuente_ID = this.counterpartForm.value.fuentes || '';
        this.CounterEdit.contrapartida.descripcion = this.counterpartForm.get('Descripcion')?.value || '';
        this.CounterEdit.contrapartida.valorAumenta = this.counterpartForm.value.ValorAumenta || 0;
        this.CounterEdit.contrapartida.valorDisminuye = this.counterpartForm.value.ValorDisminuye || 0;
  
        let putDataSave = {} as putModificationRequestI;
        putDataSave.contrapartidas = [this.CounterEdit];
        putDataSave.datos = [];
        putDataSave.idProyecto = Number(this.dataCounterparts.id_project);
        putDataSave.observacion = '';
        putDataSave.solicitudModID = Number(this.dataCounterparts.id_request);
        putDataSave.deleteReqIDs = [];
        putDataSave.deleteContraIDs = [];
  
  
        //Validar esta parte
        this.serviceModRequest.putModificationRequestSave(putDataSave).subscribe(res => {
          if (res.status == 200) {
            this.openSnackBar('Éxito al Guardar', `Contrapartida Actualizada.`, 'success');
            this.router.navigate([`/WAPI/PAA/SolicitudModificacion/${this.dataCounterparts.id_project}/${res.data.idSolicitud}`]);
            this.dialogRef.close();
          }
        }, error => {
          console.log(error);
          
        });
      }else {
        this.counterpart.fuente_ID = this.counterpartForm.value.fuentes || '';
        this.counterpart.descripcion = this.counterpartForm.get('Descripcion')?.value || '';
        this.counterpart.valorAumenta = this.counterpartForm.value.ValorAumenta || '';
        this.counterpart.valorDisminuye = this.counterpartForm.value.ValorDisminuye || '';
        
        this.dialogRef.close(this.counterpart);
      }
    } else {
      this.openSnackBar('Lo sentimos', `No hay una fuente seleccionada`, 'error', `Debe seleccionar una fuente antes de añadir.`);
    }
  }

  //Metodo para llamar alertas
  openSnackBar(title:string, message: string, type:string, message2?: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data:{title,message,message2,type},
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }

  ngOnDestroy() {
    this.counterpartSubscription.unsubscribe();
  }
}

var ProChartStorage = {
  getItem: function (key: any) {
    return localStorage.getItem(key);
  },
  setItem: function (key: any, value: any) {
    // console.log("prochart setItem")
    localStorage.setItem(key, value);
  },
  removeItem: function (key: any) {
    return localStorage.removeItem(key);
  },
  clear: function () {
    var keys = new Array();
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var key = localStorage.key(i);
      if (key?.indexOf("prochart") != -1 || key.indexOf("ProChart") != -1)
        keys.push(key);
    }
    for (var i = 0; i < keys.length; i++)
      localStorage.removeItem(keys[i]);
  }
}