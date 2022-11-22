import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { cadenaPresupuestalI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';

@Component({
  selector: 'app-budget-modification',
  templateUrl: './budget-modification.component.html',
  styleUrls: ['./budget-modification.component.scss']
})
export class BudgetModificationComponent implements OnInit {
  valueFormSubmit = new FormGroup({
    aumenta: new FormControl(),
    disminuye: new FormControl(0),
    disabled: new FormControl(false),
    iva: new FormControl(0),
    arl: new FormControl(0),
    total: new FormControl({ value: 0, disabled: true }),
  });
  isDisabled = true;
  isDisabledView = false;
  isSelected = false;
  isDisabledAum = false;
  isDisabledDis = false;
  viewDisabledAum = false;
  viewDisabledDis = false;
  type: string = '';
  formSubmit = {} as cadenaPresupuestalI
  iva: number = 0;
  arl: number = 0;
  aumenta: number = 0;
  disminuye: number = 0;
  total: number = 0;
  constructor(
    public dialogRef: MatDialogRef<BudgetModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private currencyPipe: CurrencyPipe,
  ) {
    dialogRef.disableClose = true;
    dialogRef.beforeClosed().subscribe(() => dialogRef.close(this.type));
  }

  ngOnInit(): void {
    this.valueForm(this.data.element);
    this.currencyInput();
  }
  currencyInput() {
    //use pipe to display currency
    this.valueFormSubmit.valueChanges.subscribe(form => {
      if (form.aumenta) {
        this.valueFormSubmit.patchValue({
          aumenta: this.currencyPipe.transform( "COP", 'symbol-narrow', '1.0-0') || ''
        }, { emitEvent: false })
      }
    });
  }

  valueForm(event: cadenaPresupuestalI) {
    if (this.data.type == 'ver') {
      this.isDisabledView = true;
    } else if (this.data.type == 'editar') {
      this.isDisabledView = false;
      this.valueFormSubmit.controls['aumenta'].setValue(event.subAumento);
      this.valueFormSubmit.controls['disminuye'].setValue(event.subDisminucion);
      this.valueFormSubmit.controls['iva'].setValue(event.iva);
      this.valueFormSubmit.controls['arl'].setValue(event.arl);
      this.valueFormSubmit.controls['total'].setValue(event.apropiacionDefinitiva);
      this.currencyInput();
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
    this.valueFormSubmit.controls.aumenta.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.isDisabledDis = true;
      this.viewDisabledDis = true;
      this.isDisabledAum = false;
      this.viewDisabledAum = false;
      this.valueFormSubmit.controls['disminuye'].setValue(0);
      this.formSubmit.subAumento = this.valueFormSubmit.controls['aumenta'].value || 0;
      this.formSubmit.subDisminucion = 0;
      this.valueFormSubmit.controls['total'].setValue(this.formSubmit.subAumento + this.formSubmit.iva + this.formSubmit.arl);
      this.formSubmit.aumento = this.formSubmit.subAumento + this.formSubmit.iva + this.formSubmit.arl
      this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;
      this.formSubmit.disminucion = 0;

    });
    this.valueFormSubmit.controls.disminuye.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.isDisabledAum = true;
      this.viewDisabledAum = true;
      this.isDisabledDis = false;
      this.viewDisabledDis = false;
      this.valueFormSubmit.controls['aumenta'].setValue(0);
      this.formSubmit.subDisminucion = this.valueFormSubmit.controls['disminuye'].value || 0;
      this.formSubmit.subAumento = 0;
      this.valueFormSubmit.controls['total'].setValue(this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl);
      this.formSubmit.disminucion = this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl
      this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;
      this.formSubmit.aumento = 0;


    });
    this.valueFormSubmit.controls.iva.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.formSubmit.iva = this.valueFormSubmit.controls['iva'].value || 0;
      this.valueFormSubmit.controls['total'].setValue(this.formSubmit.subAumento + this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl);
      if (this.formSubmit.subAumento != 0) {
        this.formSubmit.aumento = this.formSubmit.subAumento + this.formSubmit.iva + this.formSubmit.arl
        this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;
        this.formSubmit.disminucion = 0;

      } else if (this.formSubmit.subDisminucion != 0) {
        this.formSubmit.disminucion = this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl
        this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;
        this.formSubmit.aumento = 0;

      }

    });
    this.valueFormSubmit.controls.arl.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.formSubmit.arl = this.valueFormSubmit.controls['arl'].value || 0;
      this.valueFormSubmit.controls['total'].setValue(this.formSubmit.subAumento + this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl);
      if (this.formSubmit.subAumento != 0) {
        this.formSubmit.aumento = this.formSubmit.subAumento + this.formSubmit.iva + this.formSubmit.arl
        this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;

      }
      else if (this.formSubmit.subDisminucion != 0) {
        this.formSubmit.disminucion = this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl
        this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;

      }

    });
    this.valueFormSubmit.controls.disabled.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      if (value == true) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    });
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
  }
  onClick(): void {

    this.dialogRef.close(this.formSubmit);
  }
  valueTotal(type?: string) {
    if (type == 'aumento') {
      this.total = this.formSubmit.aumento + this.formSubmit.iva + this.formSubmit.arl - this.formSubmit.disminucion;
      this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.total;
      this.formSubmit.subAumento = this.formSubmit.aumento
      this.isDisabledDis = true;
      this.viewDisabledDis = true;
      this.type = 'aumento';
    } else if (type == 'disminucion') {
      this.total = this.formSubmit.disminucion + this.formSubmit.iva + this.formSubmit.arl;
      this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.total;
      this.formSubmit.subDisminucion = this.formSubmit.disminucion
      this.isDisabledAum = true;
      this.viewDisabledAum = true;
      this.type = 'disminucion';
    }
    //  if (this.formSubmit.aumento != 0){
    //       this.isDisabledAum = false;
    //     this.isDisabledDis = true;
    //   }
  }
}
