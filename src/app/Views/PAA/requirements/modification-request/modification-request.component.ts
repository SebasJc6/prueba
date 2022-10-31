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
import { archivosI, dateTableModificationI, filterModificationRequestI, getModificationRequestI, postDataModifApropiacionInicialI, postDataModifCadenasPresI, postDataModificationsI, postDataModifRequerimentsI, postDataModReqI, postModificationRequestI, postModificRequestCounterpartI, postModificRequestCountersI, putModificationRequestI, RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AddrequirementsComponent } from './add-requeriments/add-requeriments.component';
import { elementAt, ObservedValueUnionFromArray } from 'rxjs';
import { FilesService } from 'src/app/Services/ServicesPAA/files/files.service';
import { RequestTrayService } from 'src/app/Services/ServicesPAA/request-tray/request-tray.service';
import { filterRequestTrayI } from 'src/app/Models/ModelsPAA/request-tray/request-tray';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import { editCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { apropiacionIni, cadenasPresupuestales, cadenasPresupuestalesI, codsUNSPSC, getDataI, MODIFICACION, RequerimentDataI, requerimiento } from 'src/app/Models/ModelsPAA/Requeriment/RequerimentApproved.interface';
import jwt_decode from "jwt-decode";
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { fileDataI, postFileI, tagsI, viewTableFilesI } from 'src/app/Models/ModelsPAA/Files/Files.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatButton } from '@angular/material/button';
import { PopUpImportComponent } from './pop-up-import/pop-up-import.component';
import { v4 as uuid } from 'uuid';
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
  rtnFile: boolean = false;

  filterModificationRequest = {} as filterModificationRequestI;
  filterForm = new FormGroup({
    NumeroRequerimiento: new FormControl(),
    DependenciaDestino: new FormControl(''),
    Descripcion: new FormControl(''),
    ModalidadSeleccion: new FormControl(''),
    ActuacionContractual: new FormControl(''),
    NumeroContrato: new FormControl(''),
    TipoContrato: new FormControl(''),
    Perfil: new FormControl(''),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });
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
  arrayFile = new Array();

  dataSourcePrin!: MatTableDataSource<dateTableModificationI>;
  dataSourceAttachedFiles!: MatTableDataSource<archivosI>;
  Source = {} as getModificationRequestI;


  columnAttachedFiles: string[] = ['select', 'name',];
  selection = new SelectionModel<archivosI>(true, []);

  fileName: string = '';
  base64File: string = '';
  blockSave: string = '';
  dataFiles: any;
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
  StatusRequest: string = '';

  //Validar accion dependiendo de si se va a crear nuevo o actualización de un nuevo requerimiento
  accionRequeriment: number = 1;
  modification_Id: number = 0;

  //Se guarda toda la información del requerimiento aprovado para obtener solo la importante
  dataRequerimentApproved: getDataI[] = [];

  //Aquí se guarda la informacion importante del requerimiento aprovado que se guardará en temporal
  RequerimentToSave = {} as RequerimentDataI;

  //Propiedad con el Rol del Usuario
  AccessUser: string = '';

  //Propiedad con el es estado del proyecto
  ProjectState: string = '';

  //Propiedad para guardar la informacion a enviar en revisiones
  Revisiones = {} as RevisionSend;

  @ViewChild('btnFiltrar') btnFiltrar!: MatButton;

  constructor(
    private serviceFiles: FilesService,
    private activeRoute: ActivatedRoute,
    public router: Router, public dialog: MatDialog,
    public serviceModRequest: ModificationRequestService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,) { }


  ngOnInit(): void {
    this.filterModificationRequest.page = "1";
    this.filterModificationRequest.take = 20;
    this.dataSolicitudModID = this.activeRoute.snapshot.paramMap.get('idSol') || '';
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.getModificationRequet(Number(this.dataProjectID), Number(this.dataSolicitudModID));
    if (this.dataSolicitudModID != '0') {
      this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.filterModificationRequest);
      this.getRequestAndProject(Number(this.dataProjectID), Number(this.dataSolicitudModID));
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

    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();
  }


  ngAfterViewInit() {
    this.btnFiltrar.focus();
  }


  getRequestAndProject(id_project: number, id_request: number) {
    this.spinner.show();
    this.serviceModRequest.getModificationRequestByRequest(id_project, id_request).subscribe(res => {
      if (res.data !== null) {
        this.JustificationText = res.data.observacion;
      } else if (this.dataSolicitudModID !== '0') {
        this.openSnackBar('Lo sentimos', `Error en la Solicitud de Modificación.`, 'error', `Solicitud de Modificación no Existe.`);
        this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
      }
      this.spinner.hide();
    }, error => {

    });
  }

  getModificationRequet(projectId: number, requestID: number) {
    this.spinner.show();
    this.serviceModRequest.getModificationRequestByRequest(projectId, requestID).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.numModification = data.data.numero_Modificacion;
      this.nomProject = data.data.nombreProyecto;
      this.ProjectState = data.data.proyecto_Estado;
      this.StatusRequest = data.data.solicitud_Estado || '';
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getModificationRequestByRequestId(requestId: number, filterForm: filterModificationRequestI) {
    this.filterModificationRequest.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterModificationRequest.DependenciaDestino = this.filterForm.get('DependenciaDestino')?.value || '';
    this.filterModificationRequest.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    this.filterModificationRequest.ModalidadSeleccion = this.filterForm.get('ModalidadSeleccion')?.value || '';
    this.filterModificationRequest.ActuacionContractual = this.filterForm.get('ActuacionContractual')?.value || '';
    this.filterModificationRequest.NumeroContrato = this.filterForm.get('NumeroContrato')?.value || '';
    this.filterModificationRequest.TipoContrato = this.filterForm.get('TipoContrato')?.value || '';
    this.filterModificationRequest.Perfil = this.filterForm.get('Perfil')?.value || '';
    this.filterModificationRequest.columna = this.filterForm.get('columna')?.value || '';
    this.filterModificationRequest.ascending = this.filterForm.get('ascending')?.value || false;

    this.spinner.show();
    this.serviceModRequest.getModificationRequestByRequestId(requestId, filterForm).subscribe((data) => {
      if (data.data !== null) {
        this.viewsModificationRequest = data;
        this.ArrayDataTable = this.viewsModificationRequest.data.items;
        this.dataSourcePrin = new MatTableDataSource(this.viewsModificationRequest.data.items);
        this.numberPages = this.viewsModificationRequest.data.pages;
        this.numberPage = this.viewsModificationRequest.data.page;
        this.paginationForm.setValue({
          take: filterForm.take,
          page: filterForm.page
        });
        this.viewsCalReq = this.viewsModificationRequest.data.calculados[0].valor;
        this.viewsCalAum = this.viewsModificationRequest.data.calculados[1].valor;
        this.viewsCalDis = this.viewsModificationRequest.data.calculados[2].valor;
        this.viewsCalApr = this.viewsModificationRequest.data.calculados[3].valor;
        // console.log(this.viewsModificationRequest)

        let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataSolicitudModID}`);
        this.reloadDataTbl(fromStorage);
      } else {

      }
    }, error => {
      this.spinner.hide();
    });
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
    this.router.navigate(['/WAPI/Requerimientos/:data'])
  }

  Addrequirement() {
    const dialogRef = this.dialog.open(AddrequirementsComponent, {
      width: '1000px',
      height: '580px',
      data: this.dataProjectID,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '') {
        let requerimentNew: dateTableModificationI[] = result;

        requerimentNew.forEach(element => {
          this.ArrayDataStorage.forEach(item => {
            let index = this.ArrayDataStorage.findIndex((x: any) => x.requerimientoID === element.requerimientoID);
            if (index >= 0) {
              this.ArrayDataStorage.splice(index, 1);
            }
          });
          this.ArrayDataStorage.unshift(element);
          // this.spinner.show();
          this.serviceModRequest.getRequerimentApproved(this.dataProjectID, element.requerimientoID).subscribe(data => {
            this.dataRequerimentApproved = [];
            this.dataRequerimentApproved.push(data);
            this.getRequeriment();
            this.spinner.hide();
          }, error => {
            // this.spinner.hide();
          });

          // this.addDataTbl();
        });

        this.addDataTbl();
      }
    });
  }


  getRequeriment() {
    let codigosUNSPSC: codsUNSPSC[] = [];
    let cadenasPresupuestales: postDataModifCadenasPresI[] = [];
    let requeriment = {} as postDataModifRequerimentsI;
    let apropiacionInicial = {} as postDataModifApropiacionInicialI;
    let project_Id: number;

    let datosRequeriment: postDataModReqI;

    this.dataRequerimentApproved.forEach(element => {
      project_Id = element.data.proyecto.proj_ID;

      requeriment.actuacion_Id = element.data.requerimiento.actuacion.actuacion_ID;
      requeriment.cantidadDeContratos = element.data.requerimiento.cantidadDeContratos;
      requeriment.dependenciaDestino_Id = element.data.requerimiento.dependenciaDestino.dependencia_ID;
      requeriment.descripcion = element.data.requerimiento.descripcion;
      requeriment.duracionDias = element.data.requerimiento.duracionDias;
      requeriment.duracionMes = element.data.requerimiento.duracionMes;
      requeriment.honorarios = element.data.requerimiento.honorarios;
      requeriment.mesEstimadoInicioSeleccion = element.data.requerimiento.mesEstimadoInicioSeleccion;
      requeriment.mesEstimadoPresentacion = element.data.requerimiento.mesEstimadoPresentacion;
      requeriment.mesEstmadoInicioEjecucion = element.data.requerimiento.mesEstmadoInicioEjecucion;
      requeriment.modalidadSeleccion_Id = element.data.requerimiento.modalidadSeleccion.modalidad_Sel_ID;
      requeriment.numeroDeContrato = element.data.requerimiento.numeroDeContrato;
      requeriment.numeroModificacion = element.data.requerimiento.numeroModificacion;
      requeriment.numeroRequerimiento = element.data.requerimiento.numeroRequerimiento;
      requeriment.perfil_Id = element.data.requerimiento.perfil.perfil_ID;
      requeriment.req_ID = element.data.requerimiento.req_ID;
      requeriment.tipoContrato_Id = element.data.requerimiento.tipoContrato.tipoContrato_ID;
      requeriment.version = element.data.requerimiento.version;

      apropiacionInicial.anioV0 = element.data.apropiacionInicial.anioV0;
      apropiacionInicial.anioV1 = element.data.apropiacionInicial.anioV1;
      apropiacionInicial.anioV2 = element.data.apropiacionInicial.anioV2;
      apropiacionInicial.apropIni_ID = element.data.apropiacionInicial.apropIni_ID;
      apropiacionInicial.valor0 = element.data.apropiacionInicial.valor0;
      apropiacionInicial.valor1 = element.data.apropiacionInicial.valor1;
      apropiacionInicial.valor2 = element.data.apropiacionInicial.valor2;
      apropiacionInicial.valorTotal = element.data.apropiacionInicial.valorTotal;

      element.data.codsUNSPSC.map(elem => {
        let codigosUNS = {} as codsUNSPSC;
        codigosUNS.unspsC_ID = elem.unspsC_ID;
        codigosUNSPSC.unshift(codigosUNS);
      });
      element.data.cadenasPresupuestales.map(elem => {
        let cadenasPres = {} as postDataModifCadenasPresI;
        cadenasPres.actividad_ID = elem.actividad.actividad_ID;
        cadenasPres.anioVigRecursos = elem.anioVigRecursos;
        cadenasPres.apropiacionDefinitiva = elem.apropiacionDefinitiva;
        cadenasPres.apropiacionDisponible = elem.apropiacionDisponible;
        cadenasPres.aumento = elem.aumento;
        cadenasPres.auxiliar_ID = elem.auxiliar.auxiliar_ID;
        cadenasPres.compromisos = elem.compromisos;
        cadenasPres.disminucion = elem.disminucion;
        cadenasPres.fuente_ID = elem.fuente.fuente_ID;
        cadenasPres.giros = elem.giros;
        cadenasPres.mes = elem.mes;
        cadenasPres.mgA_ID = elem.mga.mgA_ID;
        cadenasPres.pospre_ID = elem.pospre.pospre_ID;
        cadenasPres.proj_ID = elem.project_ID;
        cadenasPres.requerimiento_ID = elem.requerimiento_ID;

        cadenasPresupuestales.unshift(cadenasPres)
      });

      let modificacion: postDataModificationsI = {
        proj_ID: project_Id,
        requerimiento: requeriment,
        cadenasPresupuestales: cadenasPresupuestales,
        apropiacionInicial: apropiacionInicial,
        codsUNSPSC: codigosUNSPSC
      }

      datosRequeriment = {
        modificacion_ID: 0,
        accion: 2,
        modificacion: modificacion
      }

      if (this.ArrayDatos.length > 0) {
        this.ArrayDatos.forEach(item => {
          let index = this.ArrayDatos.findIndex((x: any) => x.modificacion.requerimiento.req_ID === datosRequeriment.modificacion.requerimiento.req_ID);
          if (index >= 0) {
            this.ArrayDatos.splice(index, 1);
          }
          this.ArrayDatos.unshift(datosRequeriment);
        });

      } else {
        this.ArrayDatos.unshift(datosRequeriment);
      }

      let stringToStore = JSON.stringify(this.ArrayDatos);
      ProChartStorage.setItem(`arrayDatos${this.dataSolicitudModID}`, stringToStore);
    });
  }

  newRequeriment() {
    this.router.navigate([`/WAPI/PAA/PropiedadesRequerimiento/${this.dataProjectID}/${this.dataSolicitudModID}/${this.ID_REQUERIMIENTO}/Nuevo`]);
  }

  Addcounterpart() {
    this.getCodeSources();

    let dataCounterparts: any = {
      id_project: this.dataProjectID,
      id_request: this.dataSolicitudModID
    }

    const dialogRef = this.dialog.open(CounterpartComponent, {
      width: '1000px',
      height: '580px',
      data: dataCounterparts,
    });

    dialogRef.afterClosed().subscribe(result => {
      ProChartStorage.removeItem(`arrayIdSources${this.dataSolicitudModID}`);
      ProChartStorage.removeItem(`CounterpartEdit${this.dataSolicitudModID}`);
      if (result !== '' && result !== undefined) {

        let counterpart = {} as dateTableModificationI;
        counterpart.isContrapartida = true;
        counterpart.fuente = result.fuente_ID;
        counterpart.descripcion = result.descripcion;
        counterpart.valorAumenta = result.valorAumenta || 0;
        counterpart.valorDisminuye = result.valorDisminuye || 0;

        let objectsFromStorage: postModificRequestCountersI[] = [];
        let fromStorage = ProChartStorage.getItem(`arrayCounterparts${this.dataSolicitudModID}`);
        if (fromStorage != null) {
          objectsFromStorage = JSON.parse(fromStorage || '');
        }
        this.arrayCounterpart = objectsFromStorage;

        let counterparts: postModificRequestCountersI = {
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
      } else if (this.dataSolicitudModID != '0') {
        this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.filterModificationRequest);
      }
    });
  }

  addDataTbl() {
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
    this.spinner.hide();
  }


  removeDataTbl(valueToFind: any) {

    if (valueToFind.isContrapartida == true) {

      if (valueToFind.modificacion_ID != null) {
        let toFind = this.ArrayDataTable.filter((obj: any) => {
          return obj.modificacion_ID == valueToFind.modificacion_ID;
        });

        let value = toFind.pop();
        let item = value?.modificacion_ID;
        this.CounterpartsDelete.push(item || 0);

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
      if (valueToFind.numeroRequerimiento) {
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

  getInfoTableNewRequeriment() {
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
      dataTable.fuente = item.fuente_ID;
    });

    this.ArrayDataStorage.unshift(dataTable);

    ProChartStorage.removeItem('formVerifyComplete');
    this.addDataTbl();
  }

  getCodeSources() {
    let ArrayCodesSources: number[] = [];
    this.ArrayDataStorage.map(item => {
      if (item.fuente) {
        ArrayCodesSources.push(item.fuente);
      }
    });

    let stringToStore = JSON.stringify(ArrayCodesSources);
    ProChartStorage.setItem(`arrayIdSources${this.dataSolicitudModID}`, stringToStore);
  }


  ResumenModificacion() {
    this.router.navigate([`/WAPI/PAA/ResumenModificacion/${this.dataProjectID}/${this.dataSolicitudModID}`])
  }


  //Boton editar requerimiento
  editRecord(element: dateTableModificationI) {
    if (element.isContrapartida) {
      if (element.modificacion_ID) {
        const CounterpartEdit: editCounterpartI = {
          modificacion_ID: element.modificacion_ID,
          contrapartida: {
            descripcion: element.descripcion,
            fuente_ID: element.fuente,
            valorAumenta: element.valorAumenta,
            valorDisminuye: element.valorDisminuye
          }
        };

        let stringToStore = JSON.stringify(CounterpartEdit);
        ProChartStorage.setItem(`CounterpartEdit${this.dataSolicitudModID}`, stringToStore);
        this.Addcounterpart();
      }

    } else {
      if (element.modificacion_ID) {
        this.ID_REQUERIMIENTO = element.modificacion_ID;
        this.router.navigate([`/WAPI/PAA/PropiedadesRequerimiento/${this.dataProjectID}/${this.dataSolicitudModID}/${this.ID_REQUERIMIENTO}/Editar`]);
      }
    }
  }


  getPagination() {
    this.filterModificationRequest.page = this.paginationForm.get('page')?.value;
    this.filterModificationRequest.take = this.paginationForm.get('take')?.value;
    this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.filterModificationRequest);
  }

  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterModificationRequest.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterModificationRequest.DependenciaDestino = this.filterForm.get('DependenciaDestino')?.value || '';
    this.filterModificationRequest.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    this.filterModificationRequest.ModalidadSeleccion = this.filterForm.get('ModalidadSeleccion')?.value || '';
    this.filterModificationRequest.ActuacionContractual = this.filterForm.get('ActuacionContractual')?.value || '';
    this.filterModificationRequest.NumeroContrato = this.filterForm.get('NumeroContrato')?.value || '';
    this.filterModificationRequest.TipoContrato = this.filterForm.get('TipoContrato')?.value || '';
    this.filterModificationRequest.Perfil = this.filterForm.get('Perfil')?.value || '';
    this.filterModificationRequest.columna = this.filterForm.get('columna')?.value || '';
    this.filterModificationRequest.ascending = this.filterForm.get('ascending')?.value || false;

    this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.filterModificationRequest);
    this.closeFilter();
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.filterModificationRequest);
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


  openChargeFile() {
    const dialogRef = this.dialog.open(PopUpImportComponent, {
      width: '1000px',
      height: '500px',
      data: this.dataProjectID,
    });
  }


  exportFile() {
    let fecha = new Date();
    const fileName = `Reporte Solicitud Modificación_${this.codProject} (${fecha.toISOString()}).xlsx`;
    this.spinner.show();
    this.serviceModRequest.exportFile(this.dataProjectID, this.dataSolicitudModID).subscribe(res => {
      // console.log(res);
      this.manageExcelFile(res, fileName);
    }, error => {
      this.spinner.hide();
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    })
  }

  //Función que recibe y descarga el reporte excel
  manageExcelFile(response: any, fileName: string): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filePath = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    this.spinner.hide();
    downloadLink.click();
    this.openSnackBar('Éxito al Exportar', `${fileName}. Descargado correctamente.`, 'success');
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

  onFileSelected(event: any) {
    const captureFile: File = event.target.files[0]
    console.log('captureFile', captureFile)
    this.extraerBase64(captureFile).then((archivo: any) => {
      this.fileName = archivo.nameFile;
      this.base64File = archivo.base;
      // this.blockSave = this.fileName;
      // console.log('archivo', archivo)
      // this.onFileUpload();
      this.loadTableFiles();
    })

  }
  loadTableFiles() {
    // this.arrayFile = [] ;

    let viewTableFiles = {} as viewTableFilesI;

    if (this.dataSolicitudModID == '0') {
      viewTableFiles.blobName = uuid();
      viewTableFiles.fileName = this.fileName;
      viewTableFiles.fileAsBase64 = this.base64File;
      // this.arrayFile.forEach(element => {
      //   if (element.fileName == this.fileName) {
      //     this.openSnackBar('Error al Subir Archivo', `El archivo ${this.fileName} ya existe.`, 'error');
      //     this.blockSave = '';
      //     return
      //   }
      // });
      this.arrayFile.push(viewTableFiles);
    } else {
      if (this.viewsFiles.length > 0) {
        console.log('this.viewsFiles fileName', this.fileName)
        if (this.fileName == '') {
          console.log('ENTRO A ACTUALIZAR TABLE')
          this.viewsFiles.forEach((element: any) => {
            let inFiles: any = []
            inFiles.blobName = element.blobName;
            inFiles.fileName = element.fileName;
            inFiles.fileAsBase64 = '';
            this.arrayFile.push(inFiles);
            this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);

          });
        } else {
          console.log('ENTRO A AGREGAR TABLE en datatable existente')
          viewTableFiles.blobName = uuid();
          viewTableFiles.fileName = this.fileName;
          viewTableFiles.fileAsBase64 = this.base64File;
          this.arrayFile.push(viewTableFiles);
          this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);

        }
        //this.arrayFile.push(viewTableFiles);
      } else {
        console.log('ENTRO A AGREGAR TABLE')
        viewTableFiles.blobName = uuid();
        viewTableFiles.fileName = this.fileName;
        viewTableFiles.fileAsBase64 = this.base64File;
        this.arrayFile.push(viewTableFiles);
        this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);

      }

    }

    //let newfile = this.viewTableFiles
  }

  addFiles(idSol: number) {
    console.log('addFiles idSol', idSol)
    console.log('addFiles this.arrayFile', this.arrayFile)


    let files: any = [];
    this.arrayFile.forEach(element => {
      let file = {} as fileDataI;
      file.fileName = element.fileName;
      file.fileAsBase64 = element.fileAsBase64;
      files.push(file);
    });
    // if (+this.dataSolicitudModID != 0) {
    //   files.forEach((element:any) => {
    //     if (element.fileAsBase64) {
    //       delete element.fileAsBase64;
    //       delete element.fileName;
    //       delete element.blobName;
    //      }
    //   });
    //   console.log('files', files)
    //   this.rtnFile = false
    // }
    console.log('addFiles files', files)
    let formPost = {} as postFileI
    let tags = {} as tagsI;
    tags.idProject = +this.dataProjectID;
    tags.idSol = idSol;
    formPost.tags = tags;
    formPost.archivos = files
    console.log('addFiles formPost', formPost)

    this.serviceFiles.postFile(formPost).subscribe(res => {
      console.log('res', res)
      if (res.status == 200) {
        this.openSnackBar('Éxito al Guardar', `Archivos Guardado.`, 'success');
        this.rtnFile = true;
      } else {
        this.openSnackBar('Lo sentimos', `Error al guardar archivos`, 'error', res.message);
        this.rtnFile = false;
      }
    }, error => {
      this.spinner.hide();
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', error.message);
      this.rtnFile = false;
    })
    return this.rtnFile;
  }
  getAllFiles(idProject: number, idRequets: number) {
    //  this.spinner.show();
    this.serviceFiles.getAllFiles(idProject, idRequets).subscribe((data) => {
      console.log('getAllFiles', data)
      this.viewsFiles = data.data;
      this.arrayFile = [];
      this.loadTableFiles();
      //  this.spinner.hide();
    }, error => {
      //   this.spinner.hide();
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    })
  }
  deleteFile(File: any) {
    this.spinner.show();

    if (File.fileAsBase64 == '') {
      var toFind = this.arrayFile.filter(function (obj: any) {
        return obj.blobName == File.blobName;
      });
      this.serviceFiles.deleteFile(toFind[0].blobName).subscribe((data) => {
        console.log('deleteFile', data)
        this.getAllFiles(+this.dataProjectID, +this.dataSolicitudModID);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      })
    } else {
      var index = this.arrayFile.findIndex((x: any) => x.blobName === File.blobName);
      console.log('index', index)
      this.arrayFile.splice(index, 1);
      this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
      this.spinner.hide();
    }
    // console.log('blobName delete', blobName)

  }
  dowloadFile(File: any) {
    this.spinner.show();
    if (File.fileAsBase64 == '') {
      // console.log('blobName dowload', blobName)
      this.serviceFiles.dowloadFile(File.blobName).subscribe((dataFile) => {
        // console.log('dowloadFile', dataFile)
        this.dataFiles = dataFile;
        this.downloadPdf(this.dataFiles.fileAsBase64, this.dataFiles.fileName);
        // this.getAllFiles(+this.dataProjectID, +this.dataSolicitudModID);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      })
    } else {
      this.downloadPdf(File.fileAsBase64, File.fileName);
      this.spinner.hide();
    }

  }
  downloadPdf(base64String: string, fileName: string) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
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
    // console.log(arrayCounterpartsSave);


    if (this.dataSolicitudModID == '0') {
      let postDataSave = {} as postModificationRequestI;
      postDataSave.contrapartidas = arrayCounterpartsSave;
      postDataSave.datos = arrayDataSave;
      postDataSave.idProyecto = Number(this.dataProjectID);
      postDataSave.observacion = this.JustificationText;

      this.spinner.show();
      this.serviceModRequest.postModificationRequestSave(postDataSave).subscribe(res => {
        //console.log(res);
        let idSolicitud = res.data.idSolicitud;

        if (res.status == 200) {
          //guardar archivos
          let filesUp: boolean = this.addFiles(idSolicitud);
          //console.log('files return', filesUp);
          if (filesUp == true) {
            this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Actualizada y Guardada con éxito.`, 'success');
            //Elimación de los registros en LocalStorage
            ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
            ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
            ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          } else {
            console.log('error al guardar archivos');
            return
          }

        } else if (res.Status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', `No hay registros para guardar`, 'error', erorsMessages);
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          this.ArrayDataStorage = [];
          this.reloadDataTbl();
        } else if (res.status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', `No hay registros para guardar`, 'error', erorsMessages);
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          this.ArrayDataStorage = [];
          this.reloadDataTbl();
        }
        this.spinner.hide();
      }, error => {

        if (error.status == 400) {
          let Data: string[] = [];
          Data = Object.values(error.error.data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', error.error.Message, 'error', erorsMessages);
          // ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          // this.ArrayDataStorage = [];
          // this.reloadDataTbl();
          // this.spinner.hide();
        } else if (error.Status == 400) {
          let Data: string[] = [];
          Data = Object.values(error.error.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', error.error.Message, 'error', erorsMessages);
          // ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          // this.ArrayDataStorage = [];
          // this.reloadDataTbl();
          // this.spinner.hide();
        } else {
          this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
        }

        this.spinner.hide();
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


      this.spinner.show();
      this.serviceModRequest.putModificationRequestSave(putDataSave).subscribe(res => {
        let idSolicitud = res.data.idSolicitud;

        if (res.status == 200) {
          //guardar archivos
          let filesUp: boolean = this.addFiles(idSolicitud);
          //console.log('files return', filesUp);
          if (filesUp == true) {
            this.openSnackBar('Éxito al Guardar', `Solicitud de Modificación Actualizada y Guardada con éxito.`, 'success');
            //Elimación de los registros en LocalStorage
            ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
            ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
            ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          } else {
            console.log('error al guardar archivos');
          }

        } else if (res.status == 404) {

          let Data: string[] = [];
          Data = Object.values(res.data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.data.Message, 'error', erorsMessages);
        } else if (res.Status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
        }
        this.spinner.hide();
      }, error => {
        // console.log('Hubo un error ', error);

        if (error.status == 400) {
          let Data: string[] = [];
          Data = Object.values(error.error.Data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', error.error.Message, 'error', erorsMessages);
          // ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          // this.ArrayDataStorage = [];
          // this.reloadDataTbl();
        } else {
          this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
        }
        this.spinner.hide();
      });
    }
  }

  //Botón Enviar
  enviar() {
    let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataSolicitudModID}`);
    let fromStorageCounters = ProChartStorage.getItem(`arrayCounterparts${this.dataSolicitudModID}`);

    if (this.dataSolicitudModID == '0') {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe guardar primero la solicitud para poder enviarla.`);
    } else if (fromStorageArrayData !== null) {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe guardar o eliminar los requerimientos nuevos.`);
    } else if (fromStorageCounters !== null) {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe guardar o eliminar las contrapartidas nuevas.`);
    } else if (this.StatusRequest == 'En Modificación' || this.StatusRequest == 'En Ajuste') {

      let sendData = {
        idProyecto: this.dataProjectID,
        idSolicitud: this.dataSolicitudModID
      }

      this.spinner.show();
      this.serviceModRequest.putModificationRequestSend(sendData).subscribe(res => {
        // console.log(res);
        if (res.status == 200) {
          this.openSnackBar('Éxito al Enviar', `Solicitud de Modificación N° ${res.data.numSolicitud} Enviada con éxito.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayIdSources${this.dataSolicitudModID}`);
          this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
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
        this.spinner.hide();
      }, error => {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
        this.spinner.hide();
      });
    } else {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe estar en estado "En Modificación" ó "En Ajuste" para ser enviada.`);
    }
  }


  //Enviar revisiones
  enviarRecisiones() {
    if (this.ProjectState === 'Anteproyecto') {
      const Revisiones: RevisionSend = {
        accion: 1,
        comentarios: '',
        idProject: Number(this.dataProjectID),
        idSolicitud: Number(this.dataSolicitudModID)
      }

      this.spinner.show();
      this.serviceModRequest.putRevisionesEnviar(Revisiones).subscribe(res => {
        // console.log(res);
        if (res.status == 200) {
          this.openSnackBar('Éxito al Enviar', `Revisiones de la Solicitud de Modificación Enviadas con éxito.`, 'success');
          this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
        } else if (res.status == 400) {
          this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
        } else if (res.status == 404) {
          this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
        }
        this.spinner.hide();
      }, error => {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
        this.spinner.hide();
      });
    } else if (this.ProjectState === 'En Ejecución') {
      this.openDialog('Advertencia', 'Ingrese los comentarios de su revisión', 'warningInput', 'Seleccione el estado de la modificación con su revisión.')
    } else {
      this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `El Proyecto debe estar en estado "Anteproyecto" ó "En Ejecución".`);
    }
  }


  //Alerta PopUp
  openDialog(title: string, message: string, type: string, message2: string): void {
    const dialogRef = this.dialog.open(AlertsPopUpComponent, {
      width: '1000px',
      height: '500px',
      data: { title: title, message: message, type: type, message2: message2 },
    });

    dialogRef.afterClosed().subscribe((result: RevisionSend) => {
      if (result) {
        // console.log(result);
        const Revisiones: RevisionSend = {
          accion: result.accion,
          comentarios: result.comentarios,
          idProject: Number(this.dataProjectID),
          idSolicitud: Number(this.dataSolicitudModID)
        }

        this.spinner.show();
        this.serviceModRequest.putRevisionesEnviar(Revisiones).subscribe(res => {
          // console.log(res);
          if (res.status == 200) {
            this.openSnackBar('Éxito al Enviar', `Revisiones de la Solicitud de Modificación Enviadas con éxito.`, 'success');
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          } else if (res.status == 400) {
            this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
          } else if (res.status == 404) {
            this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
          }
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
        });
      }
    });
  }


  //Boton cancelar
  cancel() {
    this.CounterpartsDelete = [];
    this.RequerimentsDelete = [];
    ProChartStorage.removeItem(`dataTableItems${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayDatos${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayCounterparts${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayIdSources${this.dataSolicitudModID}`);
    if (this.StatusRequest === 'En Modificación' && this.AccessUser !== 'Revisor') {
      this.spinner.show();
      this.serviceModRequest.deleteModificationRequest(Number(this.dataSolicitudModID)).subscribe(res => {
        // console.log(res.status);
        if (res.status == 200) {
          this.openSnackBar('Acciones Canceladas', `Solicitud de Modificación Eliminada.`, 'success');
          this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
      });
    } else if (this.StatusRequest == null || this.StatusRequest === '') {
      this.router.navigate([`/WAPI/PAA/Requerimientos/${this.dataProjectID}`]);
    } else if (this.StatusRequest == 'En Revisión') {
      this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
    } else if (this.StatusRequest == 'En Ajuste') {
      this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
    } else if (this.StatusRequest == 'Aprobada') {
      this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
    } else if (this.StatusRequest == 'Rechazada') {
      this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
    }

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


var ProChartStorage = {
  getItem: function (key: any) {
    return localStorage.getItem(key);
  },
  setItem: function (key: any, value: any) {
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