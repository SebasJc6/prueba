import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { filterCDPsI, itemsCDPsI } from 'src/app/Models/ModelsPAA/Requeriment/cdp';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { CDPService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/cdp.service';

@Component({
  selector: 'app-cdp',
  templateUrl: './cdp.component.html',
  styleUrls: ['./cdp.component.scss']
})
export class CDPComponent implements OnInit {

  constructor( private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceModRequest: ModificationRequestService,
    private serviceCdps: CDPService,
    private spinner: NgxSpinnerService,) { }

  displayedColumns: string[] = [
    'Vigencia',
    'CDP',
    'FECHA CDP',
    'VALOR INICIAL',
    'VALOR ANULACIÓN',
    'FECHA ANULACIÓN',
    'VALOR FINAL',
    'CANTIDAD RP',
    'VALOR RP',
    'VALOR DISTRIBUIDO'
  ];

  //Información que se muestra en la tabla
  dataSource: itemsCDPsI[] = [];
  //Valor Inicial
  initialValue: number = 0;
  //Valor Anulación
  cancellationValue: number = 0;
  //Valor Final
  finalvalue: number = 0;
  //Valor RP
  valueRP: number = 0;
  //Valor Distribuido
  distributedValue: number = 0;

  dataProjectID: string = '';
  requerimentId: string = '';

  //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
  codProject: number = 0;
  nomProject: string = '';
  
  //FILTRO
  viewFilter: boolean = true;
  viewOrder: boolean = false;

  //CAMPOS PARA EL FILTRO
  filterCDPs = {} as filterCDPsI;
  filterForm = new FormGroup({
    vigencia: new FormControl(),
    numeroCDP: new FormControl(),
    fechaCDP: new FormControl(),
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
    this.getModificationRequet(Number(this.dataProjectID));
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }

  //Obtener la información del proyecto para mostrar en miga de pan
  getModificationRequet(projectId: number) {
    this.spinner.show();
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.nomProject = data.data.nombreProyecto;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


  getAllCDPsByRequerimentId(id_requeriment: number, filterForm: filterCDPsI) {
    this.filterCDPs.Vigencia = this.filterForm.value.vigencia || '';
    this.filterCDPs.CDP = this.filterForm.value.numeroCDP || '';
    this.filterCDPs.Fecha_CDP = this.filterForm.get('fechaCDP')?.value || '';
    this.filterCDPs.columna = this.filterForm.get('columna')?.value || '';
    this.filterCDPs.ascending = this.filterForm.get('ascending')?.value || false;

    this.spinner.show();
    this.serviceCdps.getCDPsByRequerimentId(id_requeriment, filterForm).subscribe(request => {
      // console.log(request);
      if (request.hasItems) {
        this.dataSource = request.items;
        this.initialValue = request.calculados[0].valor;
        this.cancellationValue = request.calculados[1].valor;
        this.finalvalue = request.calculados[2].valor;
        this.valueRP = request.calculados[3].valor;
        this.distributedValue = request.calculados[4].valor;
        this.numberPages = request.pages;
        this.numberPage = request.page;
        this.paginationForm.setValue({
          take: filterForm.take,
          page: filterForm.page
        });
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  notifyCDP() {

  }


  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterCDPs.Vigencia = this.filterForm.value.vigencia || '';
    this.filterCDPs.CDP = this.filterForm.value.numeroCDP || '';
    this.filterCDPs.Fecha_CDP = this.filterForm.get('fechaCDP')?.value || '';
    this.filterCDPs.columna = this.filterForm.get('columna')?.value || '';
    this.filterCDPs.ascending = this.filterForm.get('ascending')?.value || false;

    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    this.closeFilter();
  }


  //PAGINACIÓN
  getPagination() {
    this.filterCDPs.page = this.paginationForm.get('page')?.value;
    this.filterCDPs.take = this.paginationForm.get('take')?.value;

    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterCDPs.page = this.numberPage.toString();
      this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterCDPs.page = this.numberPage.toString();
      this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    }
  }


  firstPage() {
    this.numberPage = 1;
    this.filterCDPs.page = this.numberPage.toString();
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  latestPage() {
    this.numberPage = this.numberPages;
    this.filterCDPs.page = this.numberPage.toString();
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  regresar() {
    this.router.navigate([`/WAPI/PAA/Requerimientos/${this.dataProjectID}`]);
  }
}
