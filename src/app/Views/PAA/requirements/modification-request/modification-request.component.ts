import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { CounterpartComponent } from './counterpart/counterpart.component';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { archivosI, dateTableModificationI, filterModificationRequestI, getModificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AddrequirementsComponent } from './add-requeriments/add-requeriments.component';
import { ObservedValueUnionFromArray } from 'rxjs';
import { FilesService } from 'src/app/Services/ServicesPAA/files/files.service';


export interface smallTable {
  formato: string,
  // fotocopia:              stri
}
const ELEMENT_DATA: smallTable[] = [
  { formato: 'Formato XXXXX' },
  { formato: 'Fotocopia CC' }
]

@Component({
  selector: 'app-modification-request',
  templateUrl: './modification-request.component.html',
  styleUrls: ['./modification-request.component.scss']
})
export class ModificationRequestComponent implements OnInit {
  viewFilter: boolean = true;
  viewOrder: boolean = false;
  dataProjectID: string = '';
  requestID: string = '';
  codProject: number = 0;
  numModification: number = 0;
  nomProject: string = '';
  displayedColumns: string[] = [
    'numeroRequerimiento',
    'dependenciaDestino',
    'descripcion',
    'modalidadSeleccion',
    'actuacionContractual',
    'numeroContrato',
    'tipoContrato',
    'perfil',
    'honorarios',
    'saldoRequerimiento',
    'valorAumenta',
    'valorDisminuye',
    'nuevoSaldoApropiacion',
    'iconos'
  ];
  viewsModificationRequest: any;
  viewsAttachedFiles: any;
  viewsCalReq: any;
  viewsCalAum: any;
  viewsCalDis: any;
  viewsCalApr: any;
  viewsFiles: any;

  filterModificationRequest = {} as filterModificationRequestI;
  filterForm = new FormGroup({
    NumeroRequerimiento: new FormControl(),
    DependenciaDestino: new FormControl(''),
    Descripcion: new FormControl(''),
    ActuacionContractual: new FormControl(''),
    NumeroContrato: new FormControl(''),
    TipoContrato: new FormControl(''),
    Perfil: new FormControl(''),
    Honorarios: new FormControl(),
    SaldoRequerimiento: new FormControl(),
    ValorAumenta: new FormControl(),
    ValorDisminuye: new FormControl(),
    NuevoSaldoApropiacion: new FormControl(),
    ModalidadSeleccion: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  })
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });
  numberPagination: any;
  numberPages: number = 0;
  numberPage: number = 0;
  numberTake: number = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSourcePrin!: MatTableDataSource<dateTableModificationI>;
  dataSourceAttachedFiles!: MatTableDataSource<archivosI>;
  Source = {} as getModificationRequestI;


  columnAttachedFiles: string[] = ['select', 'name',];
  selection = new SelectionModel<archivosI>(true, []);

  fileName: string = '';
  base64File: string = '';
  blockSave: string = '';

  constructor(
    private serviceFiles: FilesService,
    private activeRoute: ActivatedRoute,
    public router: Router, public dialog: MatDialog,
    public serviceModRequest: ModificationRequestService) { }


  ngOnInit(): void {
    this.filterModificationRequest.page = "1";
    this.filterModificationRequest.take = 5;
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';
    this.getModificationRequet(+this.dataProjectID);
    this.requestID = '5';
    this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);
    this.getAllFiles(+this.dataProjectID, +this.requestID);
  }

  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.numModification = data.data.numero_Modificacion;
      this.nomProject = data.data.nombreProyecto;
      // console.log(data)
    })
  }

  getModificationRequestByRequestId(requestId: number, filterForm: filterModificationRequestI) {
    this.serviceModRequest.getModificationRequestByRequestId(requestId, filterForm).subscribe((data) => {
      this.viewsModificationRequest = data;
      this.dataSourcePrin = new MatTableDataSource(this.viewsModificationRequest.data.items);
      this.numberPages = this.viewsModificationRequest.data.pages;
      this.numberPage = this.viewsModificationRequest.data.page;
      this.viewsCalReq = this.viewsModificationRequest.data.calculados[0].valor;
      this.viewsCalAum = this.viewsModificationRequest.data.calculados[1].valor;
      this.viewsCalDis = this.viewsModificationRequest.data.calculados[2].valor;
      this.viewsCalApr = this.viewsModificationRequest.data.calculados[3].valor;
      // console.log(this.viewsModificationRequest)
    })
  }

  getAllFiles(idProject: number, idRequets: number) {
    this.serviceFiles.getAllFiles(idProject, idRequets).subscribe((data) => {
      // console.log(data)
      this.viewsFiles = data.data;
      this.dataSourceAttachedFiles = new MatTableDataSource(this.viewsFiles);
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceAttachedFiles.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSourceAttachedFiles.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: archivosI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }



  Requerimientos() {
    this.router.navigate(['/Requerimientos/:data'])
  }

  Addrequirement() {
    const dialogRef = this.dialog.open(AddrequirementsComponent, {
      width: '1000px',
      height: '580px',
      data: this.dataProjectID,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.ngOnInit();
      // console.log(`Dialog result: ${result}`);
    });
  }

  Addcounterpart() {
    const dialogRef = this.dialog.open(CounterpartComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }
  ResumenModificacion() {
    this.router.navigate(['/PAA/ResumenModificacion'])
  }



  getPagination() {
    //console.log(this.paginationForm.value);
    this.filterModificationRequest.page = this.paginationForm.get('page')?.value;
    this.filterModificationRequest.take = this.paginationForm.get('take')?.value;
    this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);

  }

  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    //console.log(this.filterForm.value)
    this.filterModificationRequest.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterModificationRequest.Descripcion = this.filterForm.get('Descripcion')?.value || '';

    this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);

    this.closeFilter();
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);
    }
  }

  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterModificationRequest.page = this.numberPage.toString();
    this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterModificationRequest.page = this.numberPage.toString();
    this.getModificationRequestByRequestId(+this.requestID, this.filterModificationRequest);
  }


  cancel() {
    this.router.navigate(['/PAA/Requerimientos/' + this.dataProjectID])
  }



  onFileSelected(event: any) {
    const captureFile: File = event.target.files[0]
    console.log(captureFile)
    this.extraerBase64(captureFile).then((archivo: any) => {
      this.fileName = archivo.nameFile;
      this.base64File = archivo.base;
      this.blockSave = this.fileName;
      console.log(archivo)
    })
  }

  extraerBase64 = async ($event: any) => new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          nameFile: $event.name,
          base: reader.result?.toString().split(',')[1]
        });
      };
      reader.onerror = error => {
        resolve({
          base: error
        });
      };
    } catch (e) {
      return e;
    }
  });

  onFileUpload() {


    // this.uploadFile.fileName = this.fileName;
    //     this.uploadFile.publicationAccepted = JSON.parse(result);
    //     this.uploadFile.file = this.base64File;
    //     if (this.uploadFile.fileName == '') {
    //       alert('Debe seleccionar un archivo');
    //     } else {
    //       this.apiFile.upFile(this.uploadFile).subscribe(data => {
    //         this.dataTable();
    //         this.blockSave = ' Archivo subido correctamente';
    //       })
    //     }

  }



}







