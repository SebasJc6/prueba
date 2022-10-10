
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
    @Inject(MAT_DIALOG_DATA) public idProject: string,) 
    { dialogRef.disableClose = true;}

  //Arreglo que guarda la información del proyecto para mostrar en la lista desplegable
  states: CounterpartInterface[] = [];

  counterpartForm = new FormGroup({
    Fuente: new FormControl(),
    Descripcion: new FormControl(''),
    ValorAumenta: new FormControl(),
    ValorDisminuye: new FormControl()
  });

  private counterpartSubscription!: Subscription;

  counterpart = {} as postModificRequestCounterpartI;

  ngOnInit(): void {
    this.getCounterpartF(this.idProject);
  }

  //Función que trae la información del proyecto de la Api
  getCounterpartF(idProject: string) {
    this.counterpartSubscription = this.serviceCounterpar.getCounterpartFRequest(idProject).subscribe(request => {
      this.states = request.data;
    });
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