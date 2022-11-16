import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';

@Component({
  selector: 'app-stock-orders',
  templateUrl: './stock-orders.component.html',
  styleUrls: ['./stock-orders.component.scss']
})
export class StockOrdersComponent implements OnInit {

  constructor( private activeRoute: ActivatedRoute,
    public router: Router, 
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
  dataSource: any[] = []; //TODO: -----------------------------------------
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

  OrdersChecked: any[] = [];  //TODO: -----------------------------------------
  selection = new SelectionModel<any>(true, []); //TODO: -----------------------------------------

  //CAMPOS PARA EL FILTRO
  filterCDPs = {} as any; //TODO: --------------------------------------
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
    this.filterCDPs.page = "1";
    this.filterCDPs.take = 20;

    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();
  }


  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    // this.filterCDPs.Vigencia = this.filterForm.value.vigencia || '';
    // this.filterCDPs.CDP = this.filterForm.value.numeroCDP || '';
    // this.filterCDPs.Fecha_CDP = this.filterForm.get('fechaCDP')?.value || '';
    // this.filterCDPs.columna = this.filterForm.get('columna')?.value || '';
    // this.filterCDPs.ascending = this.filterForm.get('ascending')?.value || false;

    // this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
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

  checkboxLabel(row?: any): string { //TODO: ------------------------------------
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }


  //PAGINACIÓN
  getPagination() {
    this.filterCDPs.page = this.paginationForm.get('page')?.value;
    this.filterCDPs.take = this.paginationForm.get('take')?.value;

    // this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterCDPs.page = this.numberPage.toString();
      // this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterCDPs.page = this.numberPage.toString();
      // this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    }
  }


  firstPage() {
    this.numberPage = 1;
    this.filterCDPs.page = this.numberPage.toString();
    // this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  latestPage() {
    this.numberPage = this.numberPages;
    this.filterCDPs.page = this.numberPage.toString();
    // this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }

  
  //Notificar Giros
  notifyOrder() {

  }

  
  //Habilitar Giros
  enableOrder(){

  }


  regresar() {
    this.router.navigate([`/WAPI/PAA/Requerimientos/${this.dataProjectID}`]);
  }

}
