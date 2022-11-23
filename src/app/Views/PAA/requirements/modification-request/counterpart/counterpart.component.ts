
import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CounterpartInterface, editCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { postModificRequestCounterpartI, putModificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
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
    private authService: AuthenticationService,
    private currencyPipe: CurrencyPipe,
    @Inject(MAT_DIALOG_DATA) public dataCounterparts: any,
    private spinner: NgxSpinnerService,) { dialogRef.disableClose = true;}

  //Arreglo que guarda la información del proyecto para mostrar en la lista desplegable
  states: CounterpartInterface[] = [];

  Source = {} as CounterpartInterface;
  SourcesGet: any[] = [];
  ArraySources: CounterpartInterface[] = [];

  CounterEdit = {} as editCounterpartI;
  ModificationId: number = 0;

  //Estado de la solicitud d modificación
  StatusRequest: string = '';

  //Propiedad con el Rol del Usuario
  AccessUser: string = '';

  //Disabled Valor Aumenta
  dissabledIncreases: boolean = false;

  //Disabled Valor Disminuye
  dissabledDecreases: boolean = false;

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
    this.StatusRequest = this.dataCounterparts.statusRequest;

    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();
    
    this.currentPipeReplace();
  }

  ngAfterViewInit() {

  }

  //Función que trae la información del proyecto de la Api
  getCounterpartF(idRequest: string) {
    this.counterpartSubscription = this.serviceCounterpar.getCounterpartFRequest(idRequest).subscribe(request => {
      this.states = request.data;
    }, error => {

    });
  }

  currentPipeReplace() {
    this.counterpartForm.valueChanges.subscribe( form => {
      if (form.ValorAumenta) {
        this.counterpartForm.patchValue({
          ValorAumenta: this.currencyPipe.transform(form.ValorAumenta.replace(/\D/g, '').replace(/^0+/, ''), 'COP', 'symbol-narrow', '1.0-0')
        }, {emitEvent: false});
      }
      if (form.ValorDisminuye) {
        this.counterpartForm.patchValue({
          ValorDisminuye: this.currencyPipe.transform(form.ValorDisminuye.replace(/\D/g, '').replace(/^0+/, ''), 'COP', 'symbol-narrow', '1.0-0')
        }, {emitEvent: false});
      }
    });
  }

  quitCurrencyPipe(element: string) {
    return element.replace(/\$+/g, '').replace(/,/g, "");
  }

  getSourcesTemporal() {
    let fromStorage: any = ProChartStorage.getItem(`arrayIdSources${this.dataCounterparts.id_project}${this.dataCounterparts.id_request}`);
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
        }, error => {
        });

        //TODO: Revisar esta parte
        this.SourcesGet.map(item => {
          this.Source.descripcion = item.descripcion;
          this.Source.fuente_ID = item.fuente_ID;
    
          this.ArraySources.push(this.Source);
          return this.ArraySources;
        });
      }
    }
  }

  cargarDataEdit() {
    let CounterFromStorage = ProChartStorage.getItem(`CounterpartEdit${this.dataCounterparts.id_project}${this.dataCounterparts.id_request}`);
    
    if (CounterFromStorage?.length != 0 && CounterFromStorage !== null) {
      this.CounterEdit = JSON.parse(CounterFromStorage || '');
      this.ModificationId = this.CounterEdit.modificacion_ID;
      this.counterpartForm.controls['fuentes'].setValue(this.CounterEdit.contrapartida.fuente_ID);
      this.counterpartForm.controls['Descripcion'].setValue(this.CounterEdit.contrapartida.descripcion);
      this.counterpartForm.controls['ValorAumenta'].setValue(this.CounterEdit.contrapartida.valorAumenta);
      this.counterpartForm.controls['ValorDisminuye'].setValue(this.CounterEdit.contrapartida.valorDisminuye);

      if (this.CounterEdit.contrapartida.valorAumenta !== 0 && this.CounterEdit.contrapartida.valorAumenta !== null) {
        this.dissabledIncreases = false;
        this.dissabledDecreases = true;
      } else if (this.CounterEdit.contrapartida.valorDisminuye !== 0 && this.CounterEdit.contrapartida.valorDisminuye !== null){
        this.dissabledIncreases = true;
        this.dissabledDecreases = false;
      }
    }
  }

  //Manejo del input Valor Aumenta
  onPressValueIncreases() {
    let valorAumenta = this.counterpartForm.value.ValorAumenta;
    if (valorAumenta !== null) {
      this.dissabledDecreases = true;
      this.dissabledIncreases = false;
    } else {
      this.dissabledIncreases = false;
      this.dissabledDecreases = false;
    }
  }


  //Manejo del input Valor Disminuye
  onPressValueDecreases(){
    let valorDisminuye = this.counterpartForm.value.ValorDisminuye;
    if (valorDisminuye !== null) {
      this.dissabledDecreases = false;
      this.dissabledIncreases = true;
    } else {
      this.dissabledIncreases = false;
      this.dissabledDecreases = false;
    }
  }


  closedDialog(){
    if (this.counterpartForm.value.fuentes){
      if (this.ModificationId != 0) {
        this.CounterEdit.contrapartida.fuente_ID = this.counterpartForm.value.fuentes || '';
        this.CounterEdit.contrapartida.descripcion = this.counterpartForm.get('Descripcion')?.value || '';
        let rawValueAumento = this.counterpartForm.value.ValorAumenta || 0;
        let rawValueDisminucion = this.counterpartForm.value.ValorDisminuye || 0;
        this.CounterEdit.contrapartida.valorAumenta =  rawValueAumento.replace(/\$+/g, '').replace(/,/g, "");
        this.CounterEdit.contrapartida.valorDisminuye = rawValueDisminucion.replace(/\$+/g, '').replace(/,/g, "");

        let putDataSave = {} as putModificationRequestI;
        putDataSave.contrapartidas = [this.CounterEdit];
        putDataSave.datos = [];
        putDataSave.idProyecto = Number(this.dataCounterparts.id_project);
        putDataSave.observacion = '';
        putDataSave.solicitudModID = Number(this.dataCounterparts.id_request);
        putDataSave.deleteReqIDs = [];
        putDataSave.deleteContraIDs = [];

        //Validar esta parte
        this.spinner.show();
        this.serviceModRequest.putModificationRequestSave(putDataSave).subscribe(res => {
          if (res.status == 200) {
            this.openSnackBar('Éxito al Guardar', `Contrapartida Actualizada.`, 'success');
            this.router.navigate([`/WAPI/PAA/SolicitudModificacion/${this.dataCounterparts.id_project}/${res.data.idSolicitud}`]);
            this.dialogRef.close();
          }
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
        });
      }else {
        this.counterpart.fuente_ID = this.counterpartForm.value.fuentes || '';
        this.counterpart.descripcion = this.counterpartForm.get('Descripcion')?.value || '';
        let rawValueAumento = this.counterpartForm.value.ValorAumenta || '';
        let rawValueDisminucion = this.counterpartForm.value.ValorDisminuye || '';
        this.counterpart.valorAumenta = rawValueAumento.replace(/\$+/g, '').replace(/,/g, "");
        this.counterpart.valorDisminuye = rawValueDisminucion.replace(/\$+/g, '').replace(/,/g, "");

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


  validateFormat(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
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