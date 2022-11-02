import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';

@Component({
  selector: 'app-cdp',
  templateUrl: './cdp.component.html',
  styleUrls: ['./cdp.component.scss']
})
export class CDPComponent implements OnInit {

  constructor( private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceModRequest: ModificationRequestService,
    private spinner: NgxSpinnerService,) { }

  displayedColumns: string[] = [
    'Vigencia',
    'CDP',
    'FECHA CDP',
    'VALOR INICIAL',
    'VALOR ANULACIÓN',
    'FECHA ANULACIÓN',
    'VALOR FINAL',
    'No. RP',
    'VALOR RP',
    'VALOR DISTRIBUIDO'
  ];

  dataSource: any[] = []; //TODO: Crear interfaces similares a Modification Sumary

  dataProjectID: string = '';
  requerimentId: string = '';

  //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
  codProject: number = 0;
  nomProject: string = '';
  
  //FILTRO
  viewFilter: boolean = true;
  viewOrder: boolean = false;

  //CAMPOS PARA EL FILTRO
  // filterRequestTray = {} as filterRequestTrayI;
  filterForm = new FormGroup({
    Vigencia: new FormControl(''),
    CDP: new FormControl(),
    FechaCDP: new FormControl(),
    ValorInicial: new FormControl(),
    ValorAnulacion: new FormControl(),
    FechaAnulacion: new FormControl(),
    ValorFinal: new FormControl(),
    NumeroRP: new FormControl(),
    ValorRP: new FormControl(),
    ValorDistribuido: new FormControl(),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });
  
  //Paginación
  pageSummary = {} as any; //TODO: Crear interfaces similares a Modification Sumary

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
    this.getModificationRequet(Number(this.dataProjectID));
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
    // this.filterModificationRequest.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    // this.filterModificationRequest.DependenciaDestino = this.filterForm.get('DependenciaDestino')?.value || '';
    // this.filterModificationRequest.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    // this.filterModificationRequest.ModalidadSeleccion = this.filterForm.get('ModalidadSeleccion')?.value || '';
    // this.filterModificationRequest.ActuacionContractual = this.filterForm.get('ActuacionContractual')?.value || '';
    // this.filterModificationRequest.NumeroContrato = this.filterForm.get('NumeroContrato')?.value || '';
    // this.filterModificationRequest.TipoContrato = this.filterForm.get('TipoContrato')?.value || '';
    // this.filterModificationRequest.Perfil = this.filterForm.get('Perfil')?.value || '';
    // this.filterModificationRequest.columna = this.filterForm.get('columna')?.value || '';
    // this.filterModificationRequest.ascending = this.filterForm.get('ascending')?.value || false;

    // this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.filterModificationRequest);
    this.closeFilter();
  }


  //PAGINACIÓN
  getPagination() {
    this.pageSummary.page = this.paginationForm.get('page')?.value;
    this.pageSummary.take = this.paginationForm.get('take')?.value;
    // this.getSummary(Number(this.dataSolicitudModID),this.selectedValueSource, this.pageSummary);
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.pageSummary.page = this.numberPage.toString();
      // this.getSummary(31,this.selectedValueSource, this.pageSummary);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.pageSummary.page = this.numberPage.toString();
      // this.getSummary(31,this.selectedValueSource, this.pageSummary);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.pageSummary.page = this.numberPage.toString();
    // this.getSummary(31,this.selectedValueSource, this.pageSummary);
  }

  latestPage() {
    this.numberPage = this.numberPages;
    this.pageSummary.page = this.numberPage.toString();
    // this.getSummary(31,this.selectedValueSource, this.pageSummary);
  }


  regresar() {
    this.router.navigate([`/WAPI/PAA/Requerimientos/${this.dataProjectID}`]);
  }
}
