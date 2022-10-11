
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CounterpartInterface } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { dateTableModificationI, postModificRequestCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { CounterpartService } from 'src/app/Services/ServicesPAA/modificationRequest/counterpart/counterpart.service';

@Component({
  selector: 'app-counterpart',
  templateUrl: './counterpart.component.html',
  styleUrls: ['./counterpart.component.scss']
})
export class CounterpartComponent implements OnInit {

  constructor( public serviceCounterpar: CounterpartService,
    public dialogRef: MatDialogRef<CounterpartComponent>,
    @Inject(MAT_DIALOG_DATA) public id_request: string,) 
    { dialogRef.disableClose = true;}

  dataSolicitudModID: string = '';

  //Arreglo que guarda la información del proyecto para mostrar en la lista desplegable
  states: CounterpartInterface[] = [];

  Source = {} as CounterpartInterface;
  SourcesGet: any[] = [];
  ArraySources: CounterpartInterface[] = [];

  counterpartForm = new FormGroup({
    Fuente: new FormControl(),
    Descripcion: new FormControl(''),
    ValorAumenta: new FormControl(),
    ValorDisminuye: new FormControl()
  });

  private counterpartSubscription!: Subscription;

  counterpart = {} as postModificRequestCounterpartI;

  ngOnInit(): void {
    this.getCounterpartF(this.id_request);
    this.getCounterpartTemporal();
  }

  //Función que trae la información del proyecto de la Api
  getCounterpartF(idProject: string) {
    this.counterpartSubscription = this.serviceCounterpar.getCounterpartFRequest(idProject).subscribe(request => {
      this.states = request.data;
    });
  }

  getCounterpartTemporal() {
    let fromStorage = ProChartStorage.getItem(`arrayIdSources${this.id_request}`);
    let listIdSource: string[] = [];
    
    
    if (fromStorage != null) {
      let objectsFromStorage: string[] = JSON.parse(fromStorage || '');
      listIdSource = objectsFromStorage.filter((item, index) => {
        return objectsFromStorage.indexOf(item) === index;
      });

      this.counterpartSubscription = this.serviceCounterpar.postFuentesGetList(listIdSource).subscribe(res => {
        this.SourcesGet = res.data;
        console.log(this.SourcesGet);
        
        
        this.SourcesGet.map(item => {
          this.Source.descripcion = item.descripcion;
          this.Source.proyecto_Fuente_ID = item.fuente_ID;
          this.Source.proyecto_ID = 0;
  
          this.ArraySources.push(this.Source);
          return this.ArraySources;
        });

        this.states.concat(this.ArraySources);
      });
      
      //console.log(this.ArraySources);
      
      
    }
    
    //console.log(this.states);
    
  }

  closedDialog(){
    this.counterpart.fuente_ID = this.counterpartForm.value.Fuente.fuente_ID || '';
    this.counterpart.descripcion = this.counterpartForm.get('Descripcion')?.value || '';
    this.counterpart.valorAumenta = this.counterpartForm.value.ValorAumenta || '';
    this.counterpart.valorDisminuye = this.counterpartForm.value.ValorDisminuye || '';

    this.dialogRef.close(this.counterpart);
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