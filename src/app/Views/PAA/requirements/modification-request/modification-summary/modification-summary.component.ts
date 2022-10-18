import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { itemsModificationSummaryI, pageModificationSummaryI } from 'src/app/Models/ModelsPAA/modificatioRequest/modification-summary/modification-summary';
import { Sources } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { ModificationSummaryService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-summary/modification-summary.service';


@Component({
  selector: 'app-modification-summary',
  templateUrl: './modification-summary.component.html',
  styleUrls: ['./modification-summary.component.scss']
})
export class ModificationSummaryComponent implements OnInit {

  constructor(  public router: Router,
    private summaryService: ModificationSummaryService,
    private activeRoute: ActivatedRoute,
    private serviceModRequest: ModificationRequestService) { }
  
    dataProjectID: string = '';
    dataSolicitudModID: string = '';

    //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
    codProject: number = 0;
    nomProject: string = '';  
    
  //Interfaz para las fuentes
  states: Sources[] = [];

  //Valor de la lista desplegable Fuentes
  selectedValueSource: number = 0;

  displayedColumns: string[] = [
    'pospre',
    'mga',
    'auxiliar',
    'actividad',
    'sumaAumenta',
    'sumaDisminuye',
    'diferencia',
  ];

  dataSource: itemsModificationSummaryI [] = [];
  // dataSource!: MatTableDataSource<itemsModificationSummaryI>;
  //Valores calculados
  //1 - Aumenta
  Increases: number = 0;
  //2 - Disminuye
  Decreases: number = 0;
  //3 - Diferencia
  Gap: number = 0;

  //Paginación
  pageSummary = {} as pageModificationSummaryI;

  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  numberPages: number = 0;
  numberPage: number = 0;

  ngOnInit(): void {
    this.pageSummary.page = "1";
    this.pageSummary.take = 20;

    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.dataSolicitudModID = this.activeRoute.snapshot.paramMap.get('idSol') || '';
    this.getSources(this.dataSolicitudModID);
    this.getSummary(Number(this.dataSolicitudModID),this.selectedValueSource, this.pageSummary);
    this.getModificationRequet(Number(this.dataProjectID));
  }

  //Función que obtiene las fuentes para la lista desplegable
  getSources(dataSolicitudModID: string) {
    this.summaryService.getSourcesRequest(dataSolicitudModID).subscribe(request => {
      this.states = request.data;
    });
  }

  getSummary(solModId: number, fuenteId: number, pageSummary: pageModificationSummaryI) {
    this.summaryService.getSummary(solModId, fuenteId, pageSummary).subscribe(request => {
      this.dataSource = request.data.items;
      this.Increases = request.data.calculados[0].valor;
      this.Decreases = request.data.calculados[1].valor;
      this.Gap = request.data.calculados[2].valor;
      this.numberPage = request.data.page;
      this.numberPages = request.data.pages;
      this.paginationForm.setValue({
        take: pageSummary.take,
        page: pageSummary.page
      });
    });
  }

  //Obtener la información del proyecto para mostrar en miga de pan
  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.nomProject = data.data.nombreProyecto;
    });
  }

  //Metodo que ejecuta la lista desplegable Fuente de los recursos
  selectSource(){
    this.getSummary(Number(this.dataSolicitudModID),this.selectedValueSource, this.pageSummary);
  }

  //PAGINACIÓN
  getPagination() {
    this.pageSummary.page = this.paginationForm.get('page')?.value;
    this.pageSummary.take = this.paginationForm.get('take')?.value;
    this.getSummary(Number(this.dataSolicitudModID),this.selectedValueSource, this.pageSummary);
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.pageSummary.page = this.numberPage.toString();
      this.getSummary(31,this.selectedValueSource, this.pageSummary);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.pageSummary.page = this.numberPage.toString();
      this.getSummary(31,this.selectedValueSource, this.pageSummary);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.pageSummary.page = this.numberPage.toString();
    this.getSummary(31,this.selectedValueSource, this.pageSummary);
  }

  latestPage() {
    this.numberPage = this.numberPages;
    this.pageSummary.page = this.numberPage.toString();
    this.getSummary(31,this.selectedValueSource, this.pageSummary);
  }

  regresar(){
    this.router.navigate([`/WAPI/PAA/SolicitudModificacion/${this.dataProjectID}/${this.dataSolicitudModID}`])
  }

}