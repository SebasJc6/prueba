import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cadenaPresupuestalI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';

@Component({
  selector: 'app-budget-modification',
  templateUrl: './budget-modification.component.html',
  styleUrls: ['./budget-modification.component.scss']
})
export class BudgetModificationComponent implements OnInit {
  isDisabled = true;
  isDisabledView = false;
  isSelected = false;
  isDisabledAum = false;
  isDisabledDis = false;
  formSubmit = {} as cadenaPresupuestalI
  iva: number = 0;
  arl: number = 0;
  aumenta: number = 0;
  disminuye: number = 0;
  total: number = 0;
  constructor(
    public dialogRef: MatDialogRef<BudgetModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.valueForm(this.data.element);
  }
  valueForm(event: cadenaPresupuestalI) {
    if (this.data.type == 'ver') {
      this.isDisabledView = true;
    } else if (this.data.type == 'editar') {
      this.isDisabledView = false;
    }
    // console.log(event);
    this.formSubmit = event;
    this.iva = this.formSubmit.iva;
    this.arl = this.formSubmit.arl;
    this.aumenta = this.formSubmit.aumento;
    this.disminuye = this.formSubmit.disminucion;
    if (this.formSubmit.iva != 0) {
      this.isDisabled = false;
      this.isSelected = true;
    } else if (this.formSubmit.arl != 0) {
      this.isDisabled = false;
      this.isSelected = true;
    } else {
      this.isDisabled = true;
      this.isSelected = false;
    }
    this.valueTotal();
    //  this.total = this.formSubmit.disminucion + this.formSubmit.aumento + this.formSubmit.iva + this.formSubmit.arl ;    

  }
  isDisableds(event: any) {
    // console.log(event);
    if (event.checked == true) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
  // this.isDisabled= false? true: false;
  onNoClick(): void {
    this.dialogRef.close();
    this.formSubmit.aumento = this.aumenta;
  }
  valueTotal() {
    this.total = this.formSubmit.aumento + this.formSubmit.iva + this.formSubmit.arl - this.formSubmit.disminucion;
    this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.total;
    this.formSubmit.subAumento = this.formSubmit.aumento 
    this.formSubmit.subDisminucion = this.formSubmit.disminucion 
    //  if (this.formSubmit.aumento != 0){
    //       this.isDisabledAum = false;
    //     this.isDisabledDis = true;
    //   }
  }
}
