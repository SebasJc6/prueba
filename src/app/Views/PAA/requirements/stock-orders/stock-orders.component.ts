import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filterStockOrdersI, itemsStockOrdersI } from 'src/app/Models/ModelsPAA/Requeriment/StockOrders/stock-orders-interfaces';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { StockOrdersService } from 'src/app/Services/ServicesPAA/Requeriment/Stock-Orders/stock-orders.service';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-stock-orders',
  templateUrl: './stock-orders.component.html',
  styleUrls: ['./stock-orders.component.scss']
})
export class StockOrdersComponent implements OnInit {

  constructor( private activeRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private serviceStockOrders: StockOrdersService,
    private serviceModRequest: ModificationRequestService,
    private authService: AuthenticationService, ) { }

  displayedColumns: string[] = [
    'select',
    'Vigencia',
    'NumOrden',
    'FechaOrdenPago',
    'RP',
    'ValorOrdenPago',
    'ValorDistribuido',
    'SaldoPorDistribuir',
    'Giros'
  ];

  //Propiedad con el Rol del Usuario
  AccessUser: string = '';

  //Información que se muestra en la tabla
  dataSource: itemsStockOrdersI[] = [];
  //ValorOrdenPago
  paymentOrderValue: number = 0;
  //Valor distribuido
  distributedValue: number = 0;
  //Saldo por distribuir
  balanceDistribute: number = 0;

  dataProjectID: string = '';
  requerimentId: string = '';

  //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
  codProject: number = 0;
  nomProject: string = '';

  //FILTRO
  viewFilter: boolean = true;
  viewOrder: boolean = false;

  OrdersChecked: itemsStockOrdersI[] = [];
  selection = new SelectionModel<itemsStockOrdersI>(true, []);

  //CAMPOS PARA EL FILTRO
  filterStockOrders = {} as filterStockOrdersI;
  filterForm = new FormGroup({
    vigencia: new FormControl(),
    numeroOrden: new FormControl(),
    fechaOrdenPago: new FormControl(),
    RP: new FormControl(),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });

  //Paginación
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  numberPages: number = 0;
  numberPage: number = 0;


  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.requerimentId = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.filterStockOrders.page = "1";
    this.filterStockOrders.take = 20;
    this.getModificationRequet(Number(this.dataProjectID));
    this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);

    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();
  }


  //Obtener la información del proyecto para mostrar en miga de pan
  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.nomProject = data.data.nombreProyecto;
    }, error => {
    });
  }

  getAllStockOrdersByRequerimentId(id_requeriment: number, filterForm: filterStockOrdersI) {
    this.filterStockOrders.Vigencia = this.filterForm.value.vigencia || '';
    this.filterStockOrders.NumeroOrden = this.filterForm.value.numeroOrden || '';
    this.filterStockOrders.RP = this.filterForm.value.RP || '';
    this.filterStockOrders.FechaGiro = this.filterForm.get('fechaOrdenPago')?.value || '';
    this.filterStockOrders.columna = this.filterForm.get('columna')?.value || '';
    this.filterStockOrders.ascending = this.filterForm.get('ascending')?.value || false;

    this.serviceStockOrders.getStockOrdersByRequeriments(id_requeriment, filterForm).subscribe(request => {
      if (request.status === 404) {
        this.openSnackBar('Lo sentimos', `${request.message}`, 'error');
      } else if (request.status === 200) {
        if (request.data.hasItems) {
          this.dataSource = request.data.items;
          this.paymentOrderValue = request.data.calculados[0].valor;
          this.distributedValue = request.data.calculados[1].valor;
          this.balanceDistribute = request.data.calculados[2].valor;
          this.numberPage = request.data.page;
          this.numberPages = request.data.pages;
          this.paginationForm.setValue({
            take: filterForm.take,
            page: filterForm.page
          });
        } else {
          this.openSnackBar('Lo sentimos', `No hay giros asociados a este requerimiento.`, 'error');
        }
      }
    }, error => {
      
    });
  }


  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterStockOrders.Vigencia = this.filterForm.value.vigencia || '';
    this.filterStockOrders.NumeroOrden = this.filterForm.value.numeroOrden || '';
    this.filterStockOrders.RP = this.filterForm.value.RP || '';
    this.filterStockOrders.FechaGiro = this.filterForm.get('fechaOrdenPago')?.value || '';
    this.filterStockOrders.columna = this.filterForm.get('columna')?.value || '';
    this.filterStockOrders.ascending = this.filterForm.get('ascending')?.value || false;

    this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);
    this.closeFilter();
  }


  //CHECKs
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;

    this.OrdersChecked = this.selection.selected;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSource.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: itemsStockOrdersI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }


  //PAGINACIÓN
  getPagination() {
    this.filterStockOrders.page = this.paginationForm.get('page')?.value;
    this.filterStockOrders.take = this.paginationForm.get('take')?.value;

    this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);
  }


  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterStockOrders.page = this.numberPage.toString();
      this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterStockOrders.page = this.numberPage.toString();
      this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);
    }
  }


  firstPage() {
    this.numberPage = 1;
    this.filterStockOrders.page = this.numberPage.toString();
    this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);
  }


  latestPage() {
    this.numberPage = this.numberPages;
    this.filterStockOrders.page = this.numberPage.toString();
    this.getAllStockOrdersByRequerimentId(Number(this.requerimentId), this.filterStockOrders);
  }

  
  //Notificar Giros
  notifyOrder() {
    this.serviceStockOrders.patchLockStockOrders(Number(this.requerimentId)).subscribe(response => {
      if (response.status === 200) {
        if (response.data.hasBlockedAnyGiro) {
          this.openSnackBar('Giros Notificados Exitosamente', `Los Giros "${response.data.giros}" han sido bloqueados y notificados con éxito.`, 'success');
        } else {
          this.openSnackBar('Lo sentimos', `No fue posible notificar los Giros.`, 'error');
        }
      } else {
        this.openSnackBar('ERROR', `Error " ${response.status} "`, 'error');
      }
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }

  
  //Habilitar Giros
  enableOrder(){
    this.OrdersChecked = this.selection.selected;

    if (this.OrdersChecked.length > 0) {
      let ARRAY_GIROS: number[] = [];
      this.OrdersChecked.forEach(element => {
        ARRAY_GIROS.push(element.giro_ID);
      });

      let BODY_GIROS_ENABLE: any = {
        Giros: ARRAY_GIROS
      }

      this.serviceStockOrders.patchEnableOrders(Number(this.requerimentId), BODY_GIROS_ENABLE).subscribe(response => {
        
        if (response.status === 200) {
          if (response.data.hasEnableAnyGiro) {
            this.openSnackBar('Giros Habilitados Exitosamente', `Los Giros "${response.data.giros}" fueron habilitados con éxito.`, 'success');
          } else {
            this.openSnackBar('Lo sentimos', `No fue posible habilitar los Giros.`, 'error');
          }
        } else {
          this.openSnackBar('ERROR', `Error " ${response.status} "`, 'error');
        }
      }, error => {
        if (error.error.status == 422) {
          let Data: string[] = [];
          let erorsMessages = '';
          if (error.error.data != null) {   
            Data = Object.values(error.error.data);
            Data.map(item => {
              erorsMessages += item + '. ';
            });
          }
          this.openSnackBar('Lo sentimos', error.error.message, 'error', erorsMessages);
        }
      });
    } else {
      this.openSnackBar('Lo sentimos', 'Seleccione al menos un CDP bloqueado para ser habilitado.', 'error');
    }
  }

  // openDialog(title: string, message: string, type: string, message2?: string): void {
  //   const dialogRef = this.dialog.open(AlertsPopUpComponent, {
  //     width: '1000px',
  //     height: '580px',
  //     data: { title: title, message: message, type: type, message2: message2 },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {

  //   });
  // }

  regresar() {
    this.router.navigate([`/WAPI/PAA/Requerimientos/${this.dataProjectID}`]);
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


  //Expresion regular para validar que solo se ingresen numeros en la paginación
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

}
