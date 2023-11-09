import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { cadenaPresupuestalI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';

@Component({
  selector: 'app-budget-modification',
  templateUrl: './budget-modification.component.html',
  styleUrls: ['./budget-modification.component.scss']
})
export class BudgetModificationComponent implements OnInit {
  valueFormSubmit = new FormGroup({
    subAumenta: new FormControl(),
    SubDisminuye: new FormControl(),
    disabled: new FormControl(false),
    iva: new FormControl(),
    arl: new FormControl(),
    total: new FormControl({ value: '$0', disabled: true }),
  });

  isDisabled = true;
  isDisabledView = false;
  isSelected = false;
  isDisabledAum?: boolean;
  isDisabledDis?: boolean;
  viewDisabledAum: boolean = false;
  viewDisabledDis: boolean = false;
  type: string = '';
  formSubmit = {} as cadenaPresupuestalI
  iva: number = 0;
  arl: number = 0;
  aumenta: number = 0;
  disminuye: number = 0;
  subAumento: number = 0;
  subDisminucion: number = 0;
  apropiacionDefinitiva: number = 0;
  total: number = 0;
  addTaskValue: string = "";
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
    //console.log(this.data.element);
    this.currencyInput();
    if (this.data.type == 'editar') {
      this.viewDisabledAum = false;
      this.viewDisabledDis = false;
    } else if (this.data.type == 'ver') {
      // this.valueFormSubmit.get('subAumenta')?.disabled();
      this.viewDisabledAum = true;
      this.viewDisabledDis = true;
      this.isDisabledView = true;
    }
  }


  currencyInput() {
    //use pipe to display currency
    this.valueFormSubmit.valueChanges.subscribe(form => {
      if (form.subAumenta) {
        this.valueFormSubmit.patchValue({
          subAumenta: this.assignCurrencyPipe(form.subAumenta)
        }, { emitEvent: false })
      }
      if (form.SubDisminuye) {
        this.valueFormSubmit.patchValue({
          SubDisminuye: this.assignCurrencyPipe(form.SubDisminuye)
        }, { emitEvent: false })
      }
      if (form.iva) {
        this.valueFormSubmit.patchValue({
          iva: this.assignCurrencyPipe(form.iva)
        }, { emitEvent: false })
      }
      if (form.arl) {
        this.valueFormSubmit.patchValue({
          arl: this.assignCurrencyPipe(form.arl)
        }, { emitEvent: false })
      }
    });
  }

  //Función para asignar formato de moneda a un numero y retorna el numero formatrado
  assignCurrencyPipe(number: string) {
    const NUMBER_ASSIGN = this.currencyPipe.transform(number.replace(/\D/g, '').replace(/^-1+/, ''), 'COP', 'symbol-narrow', '1.0-0');
    return NUMBER_ASSIGN;
  }

  //Función que quita el formato de moneda y retorna un numero
  quitCurrencyPipe(element: string): number {
    const ELEMENT_QUIT = element.replace(/\$+/g, '').replace(/,/g, "");
    return Number(ELEMENT_QUIT);
  }

  onPressValueIncreases() {
    if (this.data.type == "editar") {
      //  this.valueFormSubmit.controls['subAumenta'].setValue(value);
      let valorAumenta = this.valueFormSubmit.controls['subAumenta'].value;
      this.formSubmit.subAumento = this.quitCurrencyPipe(valorAumenta || '0');
      this.type = 'aumento';
      this.valueFormSubmit.controls['SubDisminuye'].setValue('$0')
      // //Quitar formato al valor aumenta
      // const subAumento = String(this.valueFormSubmit.controls['aumenta'].value || 0);
      // const VALUE_SUB_AUMENTO = this.quitCurrencyPipe(subAumento);
      // this.formSubmit.subAumento = VALUE_SUB_AUMENTO;
      // this.formSubmit.subDisminucion = 0;
      // //Asignar formato al valor total
      const total = String((this.formSubmit.subAumento + this.formSubmit.iva + this.formSubmit.arl));
      const VALUE_TOTAL = this.assignCurrencyPipe(total);
      this.valueFormSubmit.controls['total'].setValue(VALUE_TOTAL);
    }


  }
  onPressValueDecreases() {
    if (this.data.type == 'editar') {

      let valorDisminuye = this.valueFormSubmit.controls['SubDisminuye'].value;
      this.formSubmit.subDisminucion = this.quitCurrencyPipe(valorDisminuye || '0');
      this.type = 'disminucion';
      this.valueFormSubmit.controls['subAumenta'].setValue('$0')

      //Quitar formato al valor disminuye
      // const subDisminucion = String(this.valueFormSubmit.controls['SubDisminuye'].value || 0);
      // const VALUE_SUB_DISMINUCION = this.quitCurrencyPipe(subDisminucion);
      // this.formSubmit.subDisminucion = VALUE_SUB_DISMINUCION;
      // this.formSubmit.subAumento = 0;
      //Asignar formato al valor total
      const total = String((this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl));
      const VALUE_TOTAL = this.assignCurrencyPipe(total);
      this.valueFormSubmit.controls['total'].setValue(VALUE_TOTAL);

      //  this.formSubmit.aumento = 0;
    }
  }

  valueForm(event: cadenaPresupuestalI) {
    if (this.data.type == 'ver') {
      this.viewDisabledAum = true;
      this.viewDisabledDis = true;
      this.valueFormSubmit.controls.subAumenta.disable();
      this.valueFormSubmit.controls['SubDisminuye'].disable();
      this.valueFormSubmit.controls.iva.disable();
      this.valueFormSubmit.controls['arl'].disable();
      this.isDisabledView = true;
      //Dar formato al valor que Aumenta
      const aumenta = String(event.subAumento);
      const VALUE_AUMENTA = this.assignCurrencyPipe(aumenta);
      //Dar formato al valor que Disminuye
      const disminuye = String(event.subDisminucion);
      const VALUE_DISMINUYE = this.assignCurrencyPipe(disminuye);
      //Dar formato al valor de iva
      const iva = String(event.iva);
      const VALUE_IVA = this.assignCurrencyPipe(iva);
      //Dar formato al valor qde arl
      const arl = String(event.arl);
      const VALUE_ARL = this.assignCurrencyPipe(arl);
      //Dar formato al valor total
      const total = String(event.subAumento + event.subDisminucion + event.iva + event.arl);
      const VALUE_TOTAL = this.assignCurrencyPipe(total);

      this.valueFormSubmit.controls['subAumenta'].setValue(VALUE_AUMENTA);
      this.valueFormSubmit.controls['SubDisminuye'].setValue(VALUE_DISMINUYE);
      this.valueFormSubmit.controls['iva'].setValue(VALUE_IVA);
      this.valueFormSubmit.controls['arl'].setValue(VALUE_ARL);
      this.valueFormSubmit.controls['total'].setValue(VALUE_TOTAL);
    } else if (this.data.type == 'editar') {
      if( event.apropiacionDisponible == 0){
        this.viewDisabledDis = false;
      this.valueFormSubmit.controls.SubDisminuye.disable();

      }else{
        this.valueFormSubmit.controls['SubDisminuye'].enabled;

      }

      this.valueFormSubmit.controls.subAumenta.enable();
      this.isDisabledView = false;
      this.formSubmit = event;
      this.iva = this.formSubmit.iva;
      this.arl = this.formSubmit.arl;
      this.aumenta = this.formSubmit.aumento;
      this.disminuye = this.formSubmit.disminucion;
      this.subAumento = this.formSubmit.subAumento;
      this.subDisminucion = this.formSubmit.subDisminucion;
      this.apropiacionDefinitiva = this.formSubmit.apropiacionDefinitiva;
      //Dar formato al valor que Aumenta
      const aumenta = String(event.subAumento);
      const VALUE_AUMENTA = this.assignCurrencyPipe(aumenta);
      //Dar formato al valor que Disminuye
      const disminuye = String(event.subDisminucion);
      const VALUE_DISMINUYE = this.assignCurrencyPipe(disminuye);
      //Dar formato al valor de iva
      const iva = String(event.iva);
      const VALUE_IVA = this.assignCurrencyPipe(iva);
      //Dar formato al valor qde arl
      const arl = String(event.arl);
      const VALUE_ARL = this.assignCurrencyPipe(arl);
      //Dar formato al valor total
      const total = String(event.subAumento + event.subDisminucion + event.iva + event.arl);
      const VALUE_TOTAL = this.assignCurrencyPipe(total);

      this.valueFormSubmit.controls['subAumenta'].setValue(VALUE_AUMENTA);
      this.valueFormSubmit.controls['SubDisminuye'].setValue(VALUE_DISMINUYE);
      this.valueFormSubmit.controls['iva'].setValue(VALUE_IVA);
      this.valueFormSubmit.controls['arl'].setValue(VALUE_ARL);
       this.valueFormSubmit.controls['total'].setValue(VALUE_TOTAL);
      this.currencyInput();
    }

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

    this.valueFormSubmit.controls.iva.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      //Quitar formato al valor del iva
      const iva = String(this.valueFormSubmit.controls['iva'].value || 0);
      const VALUE_IVA = this.quitCurrencyPipe(iva);
      this.formSubmit.iva = VALUE_IVA;
      //Asignar formato al valor total
      const total = String((this.formSubmit.subAumento + this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl));
      const VALUE_TOTAL = this.assignCurrencyPipe(total);
      this.valueFormSubmit.controls['total'].setValue(VALUE_TOTAL);
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
      //Quitar formato al valor del arl
      const arl = String(this.valueFormSubmit.controls['arl'].value || 0);
      const VALUE_ARL = this.quitCurrencyPipe(arl);
      this.formSubmit.arl = VALUE_ARL;
      //Asignar formato al valor total
      const total = String((this.formSubmit.subAumento + this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl));
      const VALUE_TOTAL = this.assignCurrencyPipe(total);
      this.valueFormSubmit.controls['total'].setValue(VALUE_TOTAL);
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
    if (event.checked == true) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
  // this.isDisabled= false? true: false;
  onNoClick(): void {
    this.dialogRef.close();
    this.formSubmit.iva = this.iva
    this.formSubmit.arl = this.arl
    this.formSubmit.aumento = this.aumenta
    this.formSubmit.disminucion = this.disminuye
    this.formSubmit.subDisminucion = this.subDisminucion
    this.formSubmit.subAumento = this.subAumento
    this.formSubmit.apropiacionDefinitiva = this.apropiacionDefinitiva


  }
  onClick(): void {
    if (this.type == 'aumento') {
      this.formSubmit.subDisminucion = 0
      this.formSubmit.disminucion = 0
      this.formSubmit.aumento = this.formSubmit.subAumento + this.formSubmit.iva + this.formSubmit.arl
      this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;
    } else if (this.type == 'disminucion') {
      this.formSubmit.subAumento = 0
      this.formSubmit.aumento = 0
      this.formSubmit.disminucion = this.formSubmit.subDisminucion + this.formSubmit.iva + this.formSubmit.arl
      this.formSubmit.apropiacionDefinitiva = this.formSubmit.apropiacionDisponible + this.formSubmit.aumento - this.formSubmit.disminucion;
    }
    this.dialogRef.close(this.formSubmit);
  }
  valueTotal(type?: string) {
    if (type == 'aumento') {

      this.formSubmit.disminucion = 0;
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

  onTaskAdd(event: any) {
    this.addTaskValue = '';

  }
}
