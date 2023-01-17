import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { dataGirosI, distribuidosI, postGirosI } from 'src/app/Models/ModelsPAA/Requeriment/StockOrders/Orders/orders.interface';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { OrdersService } from 'src/app/Services/ServicesPAA/Requeriment/Stock-Orders/Orders/orders.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  codProject: number = 0;
  nomProject: string = '';

  dataProjectID: string = '';
  idReq: string = '';
  idGir: string = '';
  numRP: number = 0;

  dataGiros = {} as dataGirosI;
  giros = {} as postGirosI;
  ngValorGirar: string = '';

  actividadesColumns: string[] = ['codigoActividad', 'pospre', 'mga', 'auxiliar', 'fuente', 'valorRP', 'girosAcumulados', 'saldoGirar', 'valorGirar', 'nuevoSaldo'];

  formValues = new FormGroup({
    valorRP: new FormControl(''),
    valorGiro: new FormControl(''),
    saldoGirar: new FormControl(''),
    valorOrden: new FormControl(''),
    pendienteDistribuir: new FormControl(''),
    valorGirar: new FormControl(''),
  });

  constructor(private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceOrder: OrdersService,
    private snackBar: MatSnackBar,
    private serviceModRequest: ModificationRequestService,
    private currencyPipe: CurrencyPipe,) { }

  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.idReq = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.idGir = this.activeRoute.snapshot.paramMap.get('idGir') || '';
    this.getGiro(+this.idReq, +this.idGir);
    this.getModificationRequet(Number(this.dataProjectID));

  }
  ngModelChange(event: any) {
    console.log(event);
  }
  //use pipe to display currency
  currencyFormat() {
    this.formValues.valueChanges.subscribe(data => {
      if (data.valorRP) {
        this.formValues.patchValue({
          valorRP: this.assignCurrencyPipe(data.valorRP)
        }, { emitEvent: false });
      }
    });
    this.assignCurrencyPipe(this.ngValorGirar);
    console.log(this.ngValorGirar);
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
  //Obtener la información del proyecto para mostrar en miga de pan
  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.nomProject = data.data.nombreProyecto;
    }, error => {
    });
  }

  getGiro(idReq: number, idGiro: number) {
    this.serviceOrder.getGiro(idReq, idGiro).subscribe((data: any) => {
      console.log(data);
      this.numRP = data.data.numeroRP;
      this.dataGiros = data.data;
      this.formValues.controls.valorRP.setValue(this.assignCurrencyPipe(data.data.valorRP.toString()));
      this.formValues.controls.valorGiro.setValue(this.assignCurrencyPipe(data.data.valorGiroAcumulado.toString()));
      this.formValues.controls.saldoGirar.setValue(this.assignCurrencyPipe(data.data.saldoPorGirar.toString()));
      this.formValues.controls.valorOrden.setValue(this.assignCurrencyPipe(data.data.valorOrdenPago.toString()));
      this.formValues.controls.pendienteDistribuir.setValue(this.assignCurrencyPipe(data.data.pendienteDistribuir.toString()));

    });
    this.currencyFormat();

  }
  valueChange(idGiro: number, clasificacionId: number, value: number) {
    let valueformat = this.assignCurrencyPipe(value.toString());
    console.log(valueformat);
    let valDistribuidos = {} as distribuidosI;
    valDistribuidos.clasificacion_ID = clasificacionId;
    valDistribuidos.valorGirar = value;

    let distribuidos = [] as distribuidosI[];
    distribuidos.map((item) => {
      if (item.clasificacion_ID == clasificacionId) {
        item.valorGirar = value;
      }
      return valueformat;
    });
    distribuidos.push(valDistribuidos);
    this.giros['requerimiento_ID'] = +this.idReq;
    this.giros['giro_ID'] = idGiro;
    this.giros['distribuidos'] = distribuidos;
  }

  cancel() {
    this.router.navigate(['/WAPI/PAA/StockOrders/', this.dataProjectID, this.idReq]);
  }
  saveGiro() {
    console.log('savegiros');
    this.postGiros();
  }

  postGiros() {
    this.serviceOrder.postGiro(this.giros).subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        this.openSnackBar('Giro', 'Se ha guardado correctamente', 'success');
        this.router.navigate(['/WAPI/PAA/StockOrders/', this.dataProjectID, this.idReq]);

      } else {
        let Data: string[] = [];
        Data = Object.values(data.data);
        let errorMessages = '';
        Data.map(item => {
          errorMessages += item + '. ';
        });
        this.openSnackBar('Error', data.message, 'error', errorMessages);

      }
    }, (err: any) => {
      let Data: string[] = [];
      Data = Object.values(err.error.data);
      let errorMessages = '';
      Data.map(item => {
        errorMessages += item + '. ';
      });
      this.openSnackBar('Error', err.error.message, 'error', errorMessages);
    })
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
