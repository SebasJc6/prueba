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
import { archivosI, dateTableModificationI, filterModificationRequestI, getModificationRequestI, postDataModificationsI, postDataModifRequerimentsI, postDataModReqI, postModificationRequestI, postModificRequestCounterpartI, postModificRequestCountersI, putModificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AddrequirementsComponent } from './add-requeriments/add-requeriments.component';
import { elementAt, ObservedValueUnionFromArray } from 'rxjs';
import { FilesService } from 'src/app/Services/ServicesPAA/files/files.service';
import { RequestTrayService } from 'src/app/Services/ServicesPAA/request-tray/request-tray.service';
import { filterRequestTrayI } from 'src/app/Models/ModelsPAA/request-tray/request-tray';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import { editCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';


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
  dataSolicitudModID: string = '';
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

  //Propiedad para guardar contrapartidas y requerimientos que se muestran en la tabla
  ArrayDataStorage: dateTableModificationI[] = [];
  ArrayDataTable: dateTableModificationI[] = [];

  //Propiedad para enviar a back
  // contrapartida = {} as postModificRequestCounterpartI;
  arrayCounterpart: postModificRequestCountersI[] = [];
  ArrayDatos: postDataModReqI[] = [];
  CounterpartsDelete: number[] = [];
  RequerimentsDelete: number[] = [];

  //Aqui se guarda el archivo a importar
  private fileTmp: any;

  //Aqui guardamos el id de una solicitud creada por importación de un excel
  idSolicitudImport: string = '';

  //Este es el nombre del campo textarea Justificación
  JustificationText: string = '';

  //Id Requerimiento
  ID_REQUERIMIENTO: number = 0;

  //Propiedad para validar el estado de una Solicitud de Modificación
  StatusRequest: number = 0;

  //Validar accion dependiendo de si se va a crear nuevo o actualización de un nuevo requerimiento
  accionRequeriment: number = 1;
  modification_Id: number = 0;

  constructor(
    private serviceFiles: FilesService,
    private activeRoute: ActivatedRoute,
    public router: Router, public dialog: MatDialog,
    public serviceModRequest: ModificationRequestService,
    private snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.filterModificationRequest.page = "1";
    this.filterModificationRequest.take = 20;
    this.dataSolicitudModID = this.activeRoute.snapshot.paramMap.get('idSol') || '';
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.getModificationRequet(+this.dataProjectID);
    if (this.dataSolicitudModID != '0') {
      this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
      this.getAllFiles(+this.dataProjectID, +this.dataSolicitudModID);
    } else {
      let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
      this.reloadDataTbl(fromStorage);
    }

    //Obtener un requerimiento de Propiedades de requerimiento
    let fromStorage = ProChartStorage.getItem(`formVerify`);
    if (fromStorage) {      
      this.getNewRequeriment();
    }
  }

  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.numModification = data.data.numero_Modificacion;
      this.nomProject = data.data.nombreProyecto;
      this.JustificationText = data.data.observacion;
      // console.log(data)
    })
  }

  getModificationRequestByRequestId(requestId: number, filterForm: filterModificationRequestI) {
    this.serviceModRequest.getModificationRequestByRequestId(requestId, filterForm).subscribe((data) => {
      this.viewsModificationRequest = data;
      console.log(data.data.items.modificacion_ID);
      
      this.ArrayDataTable = this.viewsModificationRequest.data.items;
      this.dataSourcePrin = new MatTableDataSource(this.viewsModificationRequest.data.items);
      this.numberPages = this.viewsModificationRequest.data.pages;
      this.numberPage = this.viewsModificationRequest.data.page;
      this.viewsCalReq = this.viewsModificationRequest.data.calculados[0].valor;
      this.viewsCalAum = this.viewsModificationRequest.data.calculados[1].valor;
      this.viewsCalDis = this.viewsModificationRequest.data.calculados[2].valor;
      this.viewsCalApr = this.viewsModificationRequest.data.calculados[3].valor;
      // console.log(this.viewsModificationRequest)

      let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
      this.reloadDataTbl(fromStorage);
    });
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
      if (result !== '') {
        let requeriment: dateTableModificationI[] = result;
        requeriment.map(element =>  {
          this.ArrayDataStorage.unshift(element);
        });
        this.addDataTbl();
      }
    });
  }

  newRequeriment() {
    this.router.navigate([`PAA/PropiedadesRequerimiento/${this.dataProjectID}/${this.dataSolicitudModID}/${this.ID_REQUERIMIENTO}/Nuevo`]);
  }

  Addcounterpart() {
    this.getCodeSources();
    //  let dataCounterparts: any = {
    //   id_project: this.dataProjectID,
    //   id_request: this.dataSolicitudModID
    //  }

    const dialogRef = this.dialog.open(CounterpartComponent, {
      width: '1000px',
      height: '580px',
      data: this.dataSolicitudModID,
    });

    dialogRef.afterClosed().subscribe(result => {
      ProChartStorage.removeItem(`arrayIdSources${this.dataSolicitudModID}`);
      ProChartStorage.removeItem(`CounterpartEdit${this.dataSolicitudModID}`);
      if (result !== '') {
        let counterpart = {} as dateTableModificationI;
        counterpart.isContrapartida = true;
        counterpart.fuenteId = result.fuente_ID;
        counterpart.descripcion = result.descripcion;
        counterpart.valorAumenta = result.valorAumenta || 0;
        counterpart.valorDisminuye = result.valorDisminuye || 0;

        let objectsFromStorage: postModificRequestCountersI[] = [];
        let fromStorage = ProChartStorage.getItem(`arrayCounterparts${this.dataSolicitudModID}`);
        if (fromStorage != null) {
          objectsFromStorage = JSON.parse(fromStorage || '');
        }
        this.arrayCounterpart = objectsFromStorage;
        
        let counterparts: postModificRequestCountersI  = {
          modificacion_ID: 0,
          contrapartida: {
            descripcion: result.descripcion,
            fuente_ID: result.fuente_ID,
            valorAumenta: result.valorAumenta || 0,
            valorDisminuye: result.valorDisminuye || 0
          }
        }
        this.arrayCounterpart.unshift(counterparts);

        this.ArrayDataStorage.unshift(counterpart);

        let stringToStore = JSON.stringify(this.arrayCounterpart);
        ProChartStorage.setItem(`arrayCounterparts${this.dataSolicitudModID}`, stringToStore);
        this.addDataTbl();
      }
    });
  }

  addDataTbl() {
      //console.log('addclasPresFina', this.proRequirementeForm.controls.clasPresFinaForm.value)
      let stringToStore = JSON.stringify(this.ArrayDataStorage);
      ProChartStorage.setItem(`dataTableItems${this.dataSolicitudModID}`, stringToStore);
      let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
      this.reloadDataTbl(fromStorage);
  }
  
  reloadDataTbl(value?: any) {
    if (value) {
      let objectsFromStorage: dateTableModificationI[] = JSON.parse(value || '');
      this.ArrayDataStorage = objectsFromStorage;
    }
    
    this.dataSourcePrin = new MatTableDataSource(this.ArrayDataStorage.concat(this.ArrayDataTable));
  }


  removeDataTbl(valueToFind: any) {
    
    if (valueToFind.isContrapartida == true) {
      
      if (valueToFind.modificacion_ID != null) {
        let toFind = this.ArrayDataTable.filter((obj: any) => {
          return obj.modificacion_ID == valueToFind.modificacion_ID;
        });

        let value = toFind.pop();
        let item = value?.modificacion_ID;
        this.CounterpartsDelete.push(item|| 0);
        
        let ind = this.ArrayDataTable.findIndex((x: any) => x.modificacion_ID === valueToFind.modificacion_ID);
        if (ind >= 0) {
          this.ArrayDataTable.splice(ind, 1);
          this.arrayCounterpart.splice(ind, 1);
          this.reloadDataTbl();
        }
      } else {
        let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
        let arrayCounterparts = ProChartStorage.getItem(`arrayCounterparts${this.dataSolicitudModID}`);
        let objectsFromStorage = JSON.parse(fromStorage || '');
        let objectArrayCounterparts = JSON.parse(arrayCounterparts || '');
        // console.log(objectArrayCounterparts);
        
        let toFind = objectsFromStorage.filter((obj: any) => {
          return obj.fuenteId == valueToFind.fuenteId;
        });
        // find the index of the item to delete
        let index = objectsFromStorage.findIndex((x: any) => x.descripcion === valueToFind.descripcion && x.valorAumenta === valueToFind.valorAumenta && x.valorDisminuye === valueToFind.valorDisminuye);
        let indexCounters = objectArrayCounterparts.findIndex((x: any) => x.contrapartida.descripcion === valueToFind.descripcion && x.contrapartida.valorAumenta === valueToFind.valorAumenta && x.contrapartida.valorDisminuye === valueToFind.valorDisminuye);
        if (index >= 0) {
          this.ArrayDataStorage.splice(index, 1);
          this.arrayCounterpart.splice(indexCounters, 1);

          objectsFromStorage.splice(index, 1);
          let stringToStore = JSON.stringify(objectsFromStorage);
          ProChartStorage.setItem(`dataTableItems${this.dataSolicitudModID}`, stringToStore);

          let newCounters = JSON.stringify(this.arrayCounterpart);
          ProChartStorage.setItem(`arrayCounterparts${this.dataSolicitudModID}`, newCounters);
          this.reloadDataTbl(stringToStore);
        }
      }
      
    //Si la pripiedad isContrapartida no existe o es false, entonces el registro es de un requerimiento
    } else {
      if(valueToFind.numeroRequerimiento) {
        if (valueToFind.modificacion_ID != null) {
          let toFind = this.ArrayDataTable.filter((obj: any) => {
            return obj.modificacion_ID == valueToFind.modificacion_ID;
          });

          let value = toFind.pop();
          let item = value?.modificacion_ID;          
          this.RequerimentsDelete.push(item || 0);
          
          let ind = this.ArrayDataTable.findIndex((x: any) => x.modificacion_ID === valueToFind.modificacion_ID);
          if (ind >= 0) {
            this.ArrayDataTable.splice(ind, 1);
            this.reloadDataTbl();
          }
        } else {
          let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
          let objectsFromStorage = JSON.parse(fromStorage || '');
          let toFind = objectsFromStorage.filter((obj: any) => {
            return obj.requerimientoID == valueToFind.requerimientoID;
          });

          let objectsFromStorageArrayData: any[] = [];
          let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataSolicitudModID}`);
          if (fromStorageArrayData != null) {
            objectsFromStorageArrayData = JSON.parse(fromStorageArrayData || '');
          }
          // find the index of the item to delete
          let index = objectsFromStorage.findIndex((x: any) => x.requerimientoID === valueToFind.requerimientoID);
          if (index >= 0) {
            this.ArrayDataStorage.splice(index, 1);
            this.ArrayDatos.splice(index, 1);

            objectsFromStorage.splice(index, 1);
            objectsFromStorageArrayData.splice(index, 1);
            let stringToStore = JSON.stringify(objectsFromStorage);
            let stringToStoreArrayData = JSON.stringify(objectsFromStorageArrayData);
            ProChartStorage.setItem(`dataTableItems${this.dataSolicitudModID}`, stringToStore);
            ProChartStorage.setItem(`arrayDatos${this.dataSolicitudModID}`, stringToStoreArrayData);
            this.reloadDataTbl(stringToStore);
          }
        }
      } else if (valueToFind.isContrapartida == false) {
        let toFind = this.ArrayDataTable.filter((obj: any) => {
          return obj.modificacion_ID == valueToFind.modificacion_ID;
        });
        
        let value = toFind.pop();
        let item = value?.modificacion_ID;      
        this.RequerimentsDelete.push(item || 0);
        
        let ind = this.ArrayDataTable.findIndex((x: any) => x.modificacion_ID === valueToFind.modificacion_ID);
        if (ind >= 0) {
          this.ArrayDataTable.splice(ind, 1);
          this.reloadDataTbl();
        }
      }
    }
    
  }

  getNewRequeriment() {
    let fromStorage = ProChartStorage.getItem(`formVerify`);
    let objectsFromStorage = JSON.parse(fromStorage || '');
    
    // console.log(objectsFromStorage);
    //this.ArrayDataStorage.push(objectsFromStorage.requerimiento);
    //this.reloadDataTbl();
    let fromStorageData = ProChartStorage.getItem(`arrayDatos${this.dataSolicitudModID}`);
    if (fromStorageData != null) {
      let objectsFromStorageData = JSON.parse(fromStorageData || '');
      this.ArrayDatos = objectsFromStorageData;
    }

    const infoRequeriment = {} as postDataModificationsI;
    infoRequeriment.apropiacionInicial = objectsFromStorage.apropiacionInicial;
    infoRequeriment.cadenasPresupuestales = objectsFromStorage.cadenasPresupuestales;
    infoRequeriment.codsUNSPSC = objectsFromStorage.codsUNSPSC;
    infoRequeriment.proj_ID = objectsFromStorage.proj_ID;
    infoRequeriment.requerimiento = objectsFromStorage.requerimiento;

    const requerimentDato = {} as postDataModReqI;
    requerimentDato.accion = this.accionRequeriment;
    requerimentDato.modificacion = infoRequeriment;
    requerimentDato.modificacion_ID = this.modification_Id;

    this.ArrayDatos.unshift(requerimentDato);
    let stringToStore = JSON.stringify(this.ArrayDatos);
    ProChartStorage.setItem(`arrayDatos${this.dataSolicitudModID}`, stringToStore);

    ProChartStorage.removeItem('formVerify');

    this.getInfoTableNewRequeriment();
  }

  getInfoTableNewRequeriment(){
    let fromStorage = ProChartStorage.getItem(`formVerifyComplete`);
    let objectsFromStorage = JSON.parse(fromStorage || '');
    
    let fromStorageData = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
    if (fromStorageData != null) { 
      let objectsFromStorageData = JSON.parse(fromStorageData || '');
      this.ArrayDataStorage = objectsFromStorageData;
    }
    
    let dataTable = {} as dateTableModificationI;
    dataTable.numeroRequerimiento = objectsFromStorage.infoBasica.numeroReq;
    dataTable.dependenciaDestino = objectsFromStorage.infoBasica.dependenciaDes.codigo;
    dataTable.descripcion = objectsFromStorage.infoBasica.descripcion;
    dataTable.modalidadSeleccion = objectsFromStorage.infoBasica.modalidadSel.codigo;
    dataTable.actuacionContractual = objectsFromStorage.infoBasica.actuacionCont;
    dataTable.numeroContrato = objectsFromStorage.infoBasica.numeroContrato || 0;
    dataTable.saldoRequerimiento = objectsFromStorage.infoBasica.saldoRequerimiento || 0;
    dataTable.tipoContrato = objectsFromStorage.infoBasica.tipoCont || 0;
    dataTable.perfil = objectsFromStorage.infoBasica.perfil || 0;
    dataTable.honorarios = objectsFromStorage.infoBasica.valorHonMes || 0;

    let clasificaciones: any[] = objectsFromStorage.clasificaciones;
    clasificaciones.map(item => {
      dataTable.fuenteId = item.fuente_ID;
    });
    
    this.ArrayDataStorage.unshift(dataTable);
    //console.log(this.ArrayDataStorage);

    ProChartStorage.removeItem('formVerifyComplete');
    this.addDataTbl();
  }

  getCodeSources() {
    let ArrayCodesSources: number[] = [];
    this.ArrayDataStorage.map(item => {
      if (item.fuenteId) {
        ArrayCodesSources.push(item.fuenteId);
      }
    });

    let stringToStore = JSON.stringify(ArrayCodesSources);
    ProChartStorage.setItem(`arrayIdSources${this.dataSolicitudModID}`, stringToStore);
  }


  ResumenModificacion() {
    this.router.navigate([`/PAA/ResumenModificacion/${this.dataProjectID}/${this.dataSolicitudModID}`])
  }


  //Boton editar requerimiento
  editRecord(element: dateTableModificationI) {
    if (element.isContrapartida) {
      if (element.modificacion_ID) {
        const CounterpartEdit: editCounterpartI = {
          modificacion_ID: element.modificacion_ID,
          contrapartida: {
            descripcion: element.descripcion,
            fuente_ID: element.fuenteId,
            valorAumenta: element.valorAumenta,
            valorDisminuye: element.valorDisminuye
          }
        };

        console.log(element);
        let stringToStore = JSON.stringify(CounterpartEdit);
        ProChartStorage.setItem(`CounterpartEdit${this.dataSolicitudModID}`, stringToStore);
        this.Addcounterpart();
      }

    } else {
      if (element.modificacion_ID) {
      console.log(element);
      this.ID_REQUERIMIENTO = element.modificacion_ID;
      this.router.navigate([`PAA/PropiedadesRequerimiento/${this.dataProjectID}/${this.dataSolicitudModID}/${this.ID_REQUERIMIENTO}/Editar`]);
      }
    }
  }


  getPagination() {
    //console.log(this.paginationForm.value);
    this.filterModificationRequest.page = this.paginationForm.get('page')?.value;
    this.filterModificationRequest.take = this.paginationForm.get('take')?.value;
    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
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

    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);

    this.closeFilter();
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
    }
  }

  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterModificationRequest.page = this.numberPage.toString();
    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterModificationRequest.page = this.numberPage.toString();
    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
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


  getFile(event: any) {
    const [file] = event.target.files;
    
    if (file != null) {
      this.fileTmp = {
        file: file,
        fileName: file.name
      }
      const type = this.fileTmp.fileName.split('.').pop();
      if (type === 'xlsx') {
        const body = {
          ProjectId: this.dataProjectID,
          Observacion: 'Observation'
        };
        const FILE = new FormData();
        FILE.append('file', this.fileTmp.file);
        
        this.serviceModRequest.importFile(body, FILE).subscribe(res => {
          let message = res.Message;
          let status = res.status;
          let Status = res.Status;
          let Data: string[] = [];
          

          if (status == 404) {
            Data = Object.values(res.Data);
          } else if (status == 200) {
            this.idSolicitudImport = res.data.idSolicitud;
          } else if (Status == 404) {
            Data = Object.values(res.Data);
          }

          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });

          if (status == 404) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          } else if (status == 200) {
            this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Guardada.`, 'success');
            this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
          } else if (Status == 404) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          }else if (Status == 200) {
            this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Guardada.`, 'success');
            this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
          }
        }, error => {
          let status = error.error.Status;
          let message = error.error.Message;
          let errorData: string[] = Object.values(error.error.Data);
          let erorsMessages = '';
          errorData.map(item => {
            erorsMessages += item + '. ';
          });

          if (status == 422) {
            this.openSnackBar('Lo sentimos', message, 'error', erorsMessages);
          }
        });
      }
    }
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

  //Botón Guardar
  guardar() { 
    let arrayDataSave: postDataModReqI[] = [];
    let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataSolicitudModID}`);
    if (fromStorageArrayData != null) {
      arrayDataSave = JSON.parse(fromStorageArrayData || '');
      //  console.log(arrayDataSave);
    }

    let arrayCounterpartsSave: postModificRequestCountersI[] = [];
    let fromStorageCounters = ProChartStorage.getItem(`arrayCounterparts${this.dataSolicitudModID}`);
    if (fromStorageCounters != null) {
      arrayCounterpartsSave = JSON.parse(fromStorageCounters || '');
    }
    console.log(arrayCounterpartsSave);
    
    
    if (this.dataSolicitudModID == '0') { 
      let postDataSave = {} as postModificationRequestI;
      postDataSave.contrapartidas = arrayCounterpartsSave;
      postDataSave.datos = arrayDataSave;
      postDataSave.idProyecto = Number(this.dataProjectID);
      postDataSave.observacion = this.JustificationText;
      
       this.serviceModRequest.postModificationRequestSave(postDataSave).subscribe(res => {
        
        if(res.status == 200) { 
          this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Guardada.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
          this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
        } else if (res.Status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        }
       }, error => {
         console.log(error);
       });
    } else {
      let putDataSave = {} as putModificationRequestI;
      putDataSave.contrapartidas = arrayCounterpartsSave;
      putDataSave.datos = arrayDataSave;
      putDataSave.idProyecto = Number(this.dataProjectID);
      putDataSave.observacion = this.JustificationText;
      putDataSave.solicitudModID = Number(this.dataSolicitudModID);
      putDataSave.deleteReqIDs = this.RequerimentsDelete;
      putDataSave.deleteContraIDs = this.CounterpartsDelete;
      
      console.log(arrayCounterpartsSave);
      
      this.serviceModRequest.putModificationRequestSave(putDataSave).subscribe(res => {
        
        if(res.status == 200) {
          this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Actualizada y Guardada.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`estado${this.dataSolicitudModID}`);
          this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
        } else if (res.status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        } else if (res.Status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        }
      }, error => {
        console.log('Hubo un error ', error);
        
      });
    }
  }

  //Botón Enviar
  enviar() { 
    let arrayDataSave: postDataModReqI[] = [];
    let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataSolicitudModID}`);
    if (fromStorageArrayData != null) {
      arrayDataSave = JSON.parse(fromStorageArrayData || '');
      //  console.log(arrayDataSave);
    }

    let arrayCounterpartsSave: postModificRequestCountersI[] = [];
    let fromStorageCounters = ProChartStorage.getItem(`arrayCounterparts${this.dataSolicitudModID}`);
    if (fromStorageCounters != null) {
      arrayCounterpartsSave = JSON.parse(fromStorageCounters || '');
    }
    console.log(arrayCounterpartsSave);
    
    
    if (this.dataSolicitudModID == '0') { 
      let postDataSave = {} as postModificationRequestI;
      postDataSave.contrapartidas = arrayCounterpartsSave;
      postDataSave.datos = arrayDataSave;
      postDataSave.idProyecto = Number(this.dataProjectID);
      postDataSave.observacion = this.JustificationText;
      
       this.serviceModRequest.postModificationRequestSend(postDataSave).subscribe(res => {
        // console.log(res);
        
        if(res.status == 200) { 
          this.openSnackBar('Éxito al Enviar', `Solicitud de Modificación Enviada.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
          this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
        } else if (res.Status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        }
       }, error => {
         console.log(error);
       });
    } else {
      let putDataSave = {} as putModificationRequestI;
      putDataSave.contrapartidas = arrayCounterpartsSave;
      putDataSave.datos = arrayDataSave;
      putDataSave.idProyecto = Number(this.dataProjectID);
      putDataSave.observacion = this.JustificationText;
      putDataSave.solicitudModID = Number(this.dataSolicitudModID);
      putDataSave.deleteReqIDs = this.RequerimentsDelete;
      putDataSave.deleteContraIDs = this.CounterpartsDelete;
      
      console.log(arrayCounterpartsSave);
      
      this.serviceModRequest.putModificationRequestSend(putDataSave).subscribe(res => {
        console.log(res);
        
        if(res.status == 200) {
          this.openSnackBar('Éxito al Enviar', `Solicitud de Modificación Actualizada y Enviada.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`estado${this.dataSolicitudModID}`);
          this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
        } else if (res.status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        } else if (res.Status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        }
      }, error => {
        console.log('Hubo un error ', error);
        
      });
    }
  }


  //Boton cancelar
  cancel() {    
    this.CounterpartsDelete = [];
    this.RequerimentsDelete = [];
    ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayIdSources${this.dataSolicitudModID}`);
    //this.StatusRequest = Number(ProChartStorage.getItem(`estado${this.dataSolicitudModID}`));
    if (this.StatusRequest === 1) {
      this.serviceModRequest.deleteModificationRequest(Number(this.dataSolicitudModID)).subscribe(res => {
        console.log(res.status);
        if (res.status) {
          this.router.navigate([`/PAA/BandejaDeSolicitudes`]);
          ProChartStorage.removeItem(`estado${this.dataSolicitudModID}`);
        }
      }, error => {
        console.log(error);
      });
      
    } else if(ProChartStorage.getItem(`estado${this.dataSolicitudModID}`) == null) {      
      this.router.navigate([`/PAA/Requerimientos/${this.dataProjectID}`]);
      ProChartStorage.removeItem(`estado${this.dataSolicitudModID}`);
    } else if (this.StatusRequest === 0) {
      this.router.navigate([`/PAA/Requerimientos/${this.dataProjectID}`]);
      ProChartStorage.removeItem(`estado${this.dataSolicitudModID}`);
    }

  }


    //Metodo para llamar alertas
  openSnackBar(title:string, message: string, type:string, message2?: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data:{title,message,message2,type},
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }
}


var ProChartStorage = {
  getItem: function (key: any) {
    return localStorage.getItem(key);
  },
  setItem: function (key: any, value: any) {
    // console.log("prochart setItem")
    localStorage.setItem(key, value);
  },
  removeItem: function (key: any) {
    return localStorage.removeItem(key);
  },
  clear: function () {
    var keys = new Array();
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var key = localStorage.key(i);
      if (key?.indexOf("prochart") != -1 || key.indexOf("ProChart") != -1)
        keys.push(key);
    }
    for (var i = 0; i < keys.length; i++)
      localStorage.removeItem(keys[i]);
  }
}