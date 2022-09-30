
import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CounterpartInterface } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
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

  private counterpartSubscription!: Subscription;

  ngOnInit(): void {
    this.getCounterpartF(this.idProject);
  }

  //Función que trae la información del proyecto de la Api
  getCounterpartF(idProject: string) {
    this.counterpartSubscription = this.serviceCounterpar.getCounterpartFRequest(idProject).subscribe(request => {
      this.states = request.data;
    });
  }

  ngOnDestroy() {
    this.counterpartSubscription.unsubscribe();
  }
}