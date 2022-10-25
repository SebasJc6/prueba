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
