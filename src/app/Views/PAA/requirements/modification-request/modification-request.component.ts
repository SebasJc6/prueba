import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterpartComponent } from './counterpart/counterpart.component';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { archivosI, dateTableModificationI, filterModificationRequestI, getModificationRequestI, postDataModifApropiacionInicialI, postDataModifCadenasPresI, postDataModificationsI, postDataModifRequerimentsI, postDataModReqI, postModificationRequestI, postModificRequestCountersI, putModificationRequestI, RevisionSend } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { AddrequirementsComponent } from './add-requeriments/add-requeriments.component';
import { FilesService } from 'src/app/Services/ServicesPAA/files/files.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import { editCounterpartI } from 'src/app/Models/ModelsPAA/modificatioRequest/counterpart/counterpart-interface';
import { codsUNSPSC, getDataI, RequerimentDataI } from 'src/app/Models/ModelsPAA/Requeriment/RequerimentApproved.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { AlertsPopUpComponent } from 'src/app/Templates/alerts-pop-up/alerts-pop-up.component';
import { fileDataI, postFileI, tagsI, viewTableFilesI } from 'src/app/Models/ModelsPAA/Files/Files.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatButton } from '@angular/material/button';
import { PopUpImportComponent } from './pop-up-import/pop-up-import.component';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


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
  dataValidity: number = 0;
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
    ascending: new FormControl(true)
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
  filterFileName: string = '';

  dataFiles: any;
  useNewFile: boolean = false;
  //Propiedad para guardar contrapartidas y requerimientos que se muestran en la tabla
  ArrayDataStorage: dateTableModificationI[] = [];
  ArrayDataTable: dateTableModificationI[] = [];

  //Propiedad para enviar a back
  // contrapartida = {} as postModificRequestCounterpartI;
  arrayCounterpart: postModificRequestCountersI[] = [];
  ArrayDatos: postDataModReqI[] = [];
  CounterpartsDelete: number[] = [];
  RequerimentsDelete: number[] = [];

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

  //Arreglo donde se guarda las Vigencias
  ArrayValidity: number[] = [];

  @ViewChild('btnFiltrar') btnFiltrar!: MatButton;

  constructor(
    private serviceFiles: FilesService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public serviceModRequest: ModificationRequestService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,) { }


  ngOnInit(): void {
    this.filterModificationRequest.page = "1";
    this.filterModificationRequest.take = 20;
    this.dataSolicitudModID = this.activeRoute.snapshot.paramMap.get('idSol') || '';
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.getModificationRequet(Number(this.dataProjectID), Number(this.dataSolicitudModID));
    if (this.dataSolicitudModID != '0') {
      this.getRequestAndProject(Number(this.dataProjectID), Number(this.dataSolicitudModID));
      this.getAllFiles(+this.dataProjectID, +this.dataSolicitudModID);
    } else {
      let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
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
    if (this.dataSolicitudModID != '0') {
      this.spinner.show();
      setTimeout(() => {
        this.getAllValidiy(Number(this.dataSolicitudModID));
        this.spinner.hide();
      }, 1200);
    }
  }


  getRequestAndProject(id_project: number, id_request: number) {
    this.serviceModRequest.getModificationRequestByRequest(id_project, id_request).subscribe(res => {
      if (res.data !== null) {
        this.JustificationText = res.data.observacion;
      } else if (this.dataSolicitudModID !== '0') {
        this.openSnackBar('Lo sentimos', `Error en la Solicitud de modificación.`, 'error', `Solicitud de modificación no existe.`);
        this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
      }
    }, error => {

    });
  }


  getModificationRequet(projectId: number, requestID: number) {
    this.serviceModRequest.getModificationRequestByRequest(projectId, requestID).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.numModification = data.data.numero_Modificacion;
      this.nomProject = data.data.nombreProyecto;
      this.ProjectState = data.data.proyecto_Estado;
      this.StatusRequest = data.data.solicitud_Estado || '';
      this.dataValidity = data.data.vigencia;
    }, error => {
    });
  }


  getModificationRequestByRequestId(requestId: number, validity: number, filterForm: filterModificationRequestI) {
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

    this.serviceModRequest.getModificationRequestByRequestId(requestId, validity, filterForm).subscribe((data) => {
      if (data.data.hasItems) {
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

        let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
        this.reloadDataTbl(fromStorage);
      } else {
      }
    }, error => {
    });
  }

  //Función que obtiene las vigencias
  getAllValidiy(id_request: number) {
    this.serviceModRequest.getValidityByRequest(id_request).subscribe(res => {
      this.ArrayValidity = res.data;
      if (this.dataValidity === 0) {
        this.dataValidity = res.data[0];
      }
      this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.dataValidity, this.filterModificationRequest);
    });
  }

  //Función que se ejecuta al seleccionar un valor en Vigencias
  selectValidity() {
    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.dataValidity, this.filterModificationRequest);
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
          this.serviceModRequest.getRequerimentApproved(this.dataProjectID, element.requerimientoID).subscribe(data => {
            this.dataRequerimentApproved = [];
            this.dataRequerimentApproved.push(data);
            this.getRequeriment();
            this.spinner.hide();
          }, error => {
          });
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

      requeriment.anioContrato = element.data.requerimiento.anioContrato;
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
        cadenasPres.cadena_Presupuestal_ID = elem.cadena_Presupuestal_ID;
        cadenasPres.iva = elem.iva;
        cadenasPres.arl = elem.arl;
        cadenasPres.subAumento = elem.subAumento;
        cadenasPres.subDisminucion = elem.subDisminucion;

        cadenasPresupuestales.unshift(cadenasPres);
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
      ProChartStorage.setItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
    });
  }

  newRequeriment() {
    this.router.navigate([`/WAPI/PAA/PropiedadesRequerimiento/${this.dataProjectID}/${this.dataSolicitudModID}/${this.ID_REQUERIMIENTO}/Nuevo`]);
  }

  Addcounterpart() {
    this.getCodeSources();

    let dataCounterparts: any = {
      id_project: this.dataProjectID,
      id_request: this.dataSolicitudModID,
      statusRequest: this.StatusRequest
    }

    const dialogRef = this.dialog.open(CounterpartComponent, {
      width: '1000px',
      height: '580px',
      data: {data:dataCounterparts , idProject: this.dataProjectID}
    });

    dialogRef.afterClosed().subscribe(result => {
      ProChartStorage.removeItem(`arrayIdSources${this.dataProjectID}${this.dataSolicitudModID}`);
      ProChartStorage.removeItem(`CounterpartEdit${this.dataProjectID}${this.dataSolicitudModID}`);
      if (result !== '' && result !== undefined) {

        let counterpart = {} as dateTableModificationI;
        counterpart.isContrapartida = true;
        counterpart.fuente = result.fuente_ID;
        counterpart.descripcion = result.descripcion;
        counterpart.valorAumenta = result.valorAumenta || 0;
        counterpart.valorDisminuye = result.valorDisminuye || 0;

        let objectsFromStorage: postModificRequestCountersI[] = [];
        let fromStorage = ProChartStorage.getItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
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
        ProChartStorage.setItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
        this.addDataTbl();
      } else if (this.dataSolicitudModID != '0') {
        this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.dataValidity, this.filterModificationRequest);
      }
    });
  }

  addDataTbl() {
    let stringToStore = JSON.stringify(this.ArrayDataStorage);
    ProChartStorage.setItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
    let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
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

    //Alerta de confirmación para Eliminar elemento
    Swal.fire({
      customClass: {
        confirmButton: 'swalBtnColor',
        denyButton: 'swalBtnColor'
      },
      title: '¿Está seguro que desea eliminar el registro?',
      text: `Se eliminará este registro si selecciona "SI"`,
      showDenyButton: true,
      denyButtonText: 'NO',
      confirmButtonText: 'SI',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {

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
            let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
            let arrayCounterparts = ProChartStorage.getItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
            let objectsFromStorage = JSON.parse(fromStorage || '');
            let objectArrayCounterparts = JSON.parse(arrayCounterparts || '');

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
              ProChartStorage.setItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);

              let newCounters = JSON.stringify(this.arrayCounterpart);
              ProChartStorage.setItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`, newCounters);
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
              let fromStorage = ProChartStorage.getItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
              let objectsFromStorage = JSON.parse(fromStorage || '');
              let toFind = objectsFromStorage.filter((obj: any) => {
                return obj.requerimientoID == valueToFind.requerimientoID;
              });

              let objectsFromStorageArrayData: any[] = [];
              let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
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
                ProChartStorage.setItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
                ProChartStorage.setItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`, stringToStoreArrayData);
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
    });
  }


  //Obtener requerimiento creado en Propiedades de requerimiento
  getNewRequeriment() {
    let fromStorage = ProChartStorage.getItem(`formVerify`);
    let objectsFromStorage = JSON.parse(fromStorage || '');

    let fromStorageData = ProChartStorage.getItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
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
    ProChartStorage.setItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
    ProChartStorage.removeItem('formVerify');

    this.getInfoTableNewRequeriment();
  }

  getInfoTableNewRequeriment() {
    let fromStorage = ProChartStorage.getItem(`formVerifyComplete`);
    let objectsFromStorage = JSON.parse(fromStorage || '');

    let fromStorageData = ProChartStorage.getItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
    if (fromStorageData != null) {
      let objectsFromStorageData = JSON.parse(fromStorageData || '');
      this.ArrayDataStorage = objectsFromStorageData;
    }
    let classifications: any[] = objectsFromStorage.clasificaciones;

    let dataTable = {} as dateTableModificationI;
    dataTable.valorAumenta = 0;
    dataTable.valorDisminuye = 0;
    dataTable.nuevoSaldoApropiacion = 0;
    classifications.forEach(element => {
      let valorAumenta = element.aumento;
      let valorDisminuye = element.disminucion;
      let apropiacionDefinitiva = element.apropiacionDefinitiva;
      dataTable.valorAumenta += Number(valorAumenta);
      dataTable.valorDisminuye += Number(valorDisminuye);
      dataTable.nuevoSaldoApropiacion += Number(apropiacionDefinitiva);
    });
    dataTable.numeroRequerimiento = objectsFromStorage.infoBasica.numeroReq;
    dataTable.dependenciaDestino = objectsFromStorage.infoBasica.dependenciaDes.codigo;
    dataTable.descripcion = objectsFromStorage.infoBasica.descripcion;
    dataTable.numeroContrato = objectsFromStorage.infoBasica.numeroContrato || 0;
    dataTable.saldoRequerimiento = objectsFromStorage.infoBasica.saldoRequerimiento || 0;
    dataTable.honorarios = objectsFromStorage.infoBasica.valorHonMes || 0;

    if (objectsFromStorage.infoBasica.actuacionCont != 1) {
      dataTable.tipoContrato = objectsFromStorage.infoBasica.tipoCont;
      dataTable.perfil = objectsFromStorage.infoBasica.perfil;
    } else {
      this.serviceModRequest.getTipoContrato(objectsFromStorage.infoBasica.tipoCont).subscribe(res => {
        dataTable.tipoContrato = res.data.nombre;
      });
      this.serviceModRequest.getPerfil(objectsFromStorage.infoBasica.perfil).subscribe(res => {
        dataTable.perfil = res.data.nombre_Perfil;
      });
    }

    this.serviceModRequest.getActuacion(objectsFromStorage.infoBasica.actuacionCont).subscribe(res => {
      dataTable.actuacionContractual = res.data.tipo;
    });

    this.serviceModRequest.getModalidadDeSeleccion(objectsFromStorage.infoBasica.modalidadSel).subscribe(res => {
      dataTable.modalidadSeleccion = res.data.codigo;
      setTimeout(() => {
        this.ArrayDataStorage.unshift(dataTable);
        ProChartStorage.removeItem('formVerifyComplete');
        this.addDataTbl();
      }, 2000);
    });

    let clasificaciones: any[] = objectsFromStorage.clasificaciones;
    clasificaciones.map(item => {
      dataTable.fuente = item.fuente.fuente_ID;
    });
  }

  getCodeSources() {
    let ArrayCodesSources: number[] = [];
    this.ArrayDataStorage.map(item => {
      if (item.fuente) {
        ArrayCodesSources.push(item.fuente);
      }
    });

    let stringToStore = JSON.stringify(ArrayCodesSources);
    ProChartStorage.setItem(`arrayIdSources${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
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
        ProChartStorage.setItem(`CounterpartEdit${this.dataProjectID}${this.dataSolicitudModID}`, stringToStore);
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
    this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.dataValidity, this.filterModificationRequest);
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

    this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.dataValidity, this.filterModificationRequest);
    this.closeFilter();
  }

  //Limpiar el Filtro
  clearFilter() {
    this.filterForm.reset();

    this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.dataValidity, this.filterModificationRequest);
    this.closeFilter();
  }

  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.dataValidity, this.filterModificationRequest);
    }
  }

  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterModificationRequest.page = this.numberPage.toString();
      this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.dataValidity, this.filterModificationRequest);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterModificationRequest.page = this.numberPage.toString();
    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.dataValidity, this.filterModificationRequest);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterModificationRequest.page = this.numberPage.toString();
    this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.dataValidity, this.filterModificationRequest);
  }


  openChargeFile() {
    const dataImport: any = {
      id_project: this.dataProjectID,
      id_request: this.dataSolicitudModID,
      justify: this.JustificationText
    }

    const dialogRef = this.dialog.open(PopUpImportComponent, {
      width: '1000px',
      height: '580px',
      data: dataImport,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (this.dataSolicitudModID != '0') {
        this.getModificationRequestByRequestId(Number(this.dataSolicitudModID), this.dataValidity, this.filterModificationRequest);
        this.getRequestAndProject(Number(this.dataProjectID), Number(this.dataSolicitudModID));
      }
    });
  }


  exportFile() {
    let fecha = new Date();
    const date = this.datePipe.transform(fecha,"dd-MM-yyyy");
    const fileName = `REPORTE_SOLICITUD_MODIFICACIONES ${date}.xlsx`;
    this.serviceModRequest.exportFile(this.dataProjectID, this.dataSolicitudModID).subscribe(res => {
      this.manageExcelFile(res, fileName);
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
    });
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
    this.openSnackBar('Exportado Exitosamente', `El archivo "${fileName}" fue generado correctamente.`, 'success');
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
    this.fileName = ''
    this.base64File = ''
    const captureFile: File = event.target.files[0]
    this.filterFileName = '';
    this.extraerBase64(captureFile).then((archivo: any) => {
      this.fileName = archivo.nameFile;
      this.base64File = archivo.base;
      // this.blockSave = this.fileName;
      // this.onFileUpload();
      this.loadTableFiles();
      this.useNewFile = true;
    });

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
      this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
    } else {
      if (this.viewsFiles.length > 0) {
        if (this.fileName == '') {
          this.viewsFiles.forEach((element: any) => {
            let inFiles: any = []
            inFiles.blobName = element.blobName;
            inFiles.fileName = element.fileName;
            inFiles.fileAsBase64 = '';
            this.arrayFile.push(inFiles);
            this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
          });
        } else {
          viewTableFiles.blobName = uuid();
          viewTableFiles.fileName = this.fileName;
          viewTableFiles.fileAsBase64 = this.base64File;
          this.arrayFile.push(viewTableFiles);
          this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
        }
        //this.arrayFile.push(viewTableFiles);
      } else {
        if (this.base64File != '') {
          viewTableFiles.blobName = uuid();
          viewTableFiles.fileName = this.fileName;
          viewTableFiles.fileAsBase64 = this.base64File;
          this.arrayFile.push(viewTableFiles);
        }

        this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
      }
    }

    if (this.arrayFile.length > 0) {
      this.rtnFile = true;
    } else {
      this.rtnFile = false;
    }
    //let newfile = this.viewTableFiles
  }


  addFiles(idSol: number) {
    let files: any = [];
    this.arrayFile.forEach(element => {
      let file = {} as fileDataI;
      file.fileName = element.fileName;
      file.fileAsBase64 = element.fileAsBase64;
      files.push(file);
    });
    let formPost = {} as postFileI
    let tags = {} as tagsI;
    tags.idProject = +this.dataProjectID;
    tags.idSol = idSol;
    formPost.tags = tags;
    formPost.archivos = files;


    this.serviceFiles.postFile(formPost).subscribe(res => {
      if (res.status == 200) {
        // this.openSnackBar('Guardado Exitosamente', `El archivos Guardados.`, 'success');
      } else {
        this.openSnackBar('Lo sentimos', `Error al guardar los archivos adjuntos`, 'error', res.message);
      }
    }, error => {
      // this.spinner.hide();
      this.openSnackBar('Lo sentimos', `Error interno en el sistema`, 'error', `Comuníquese con el administrador del sistema.`);
      this.rtnFile = false;
    });
  }


  getAllFiles(idProject: number, idRequets: number) {
    this.serviceFiles.getAllFiles(idProject, idRequets).subscribe((data) => {
      this.viewsFiles = data.data;
      this.arrayFile = [];
      this.loadTableFiles();
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
    })
  }


  deleteFile(File: any) {

    var index = this.arrayFile.findIndex((x: any) => x.blobName === File.blobName);
    
    if (File.fileAsBase64 == '') {
      var toFind = this.arrayFile.filter(function (obj: any) {
        return obj.blobName == File.blobName;
      });
      this.serviceFiles.deleteFile(toFind[0].blobName).subscribe((data) => {
        this.arrayFile.splice(index, 1);
        this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
        this.getAllFiles(+this.dataProjectID, +this.dataSolicitudModID);
      }, error => {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
      })
    } else {
      this.spinner.show();
      this.arrayFile.splice(index, 1);
      this.dataSourceAttachedFiles = new MatTableDataSource(this.arrayFile);
      this.spinner.hide();

    }
  }


  dowloadFile(File: any) {
    if (File.fileAsBase64 == '') {
      this.serviceFiles.dowloadFile(File.blobName).subscribe((dataFile) => {
        this.dataFiles = dataFile;
        this.downloadPdf(this.dataFiles.fileAsBase64, this.dataFiles.fileName);
        // this.getAllFiles(+this.dataProjectID, +this.dataSolicitudModID);
      }, error => {
        this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
      })
    } else {
      this.spinner.show();
      this.downloadPdf(File.fileAsBase64, File.fileName);
      this.spinner.hide();
    }
  }


  downloadPdf(base64String: string, fileName: string) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }


  //Botón Guardar
  guardar() {
    let arrayDataSave: postDataModReqI[] = [];
    let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
    if (fromStorageArrayData != null) {
      arrayDataSave = JSON.parse(fromStorageArrayData || '');
    }

    let arrayCounterpartsSave: postModificRequestCountersI[] = [];
    let fromStorageCounters = ProChartStorage.getItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
    if (fromStorageCounters != null) {
      arrayCounterpartsSave = JSON.parse(fromStorageCounters || '');
    }

    if (this.dataSolicitudModID == '0') {
      let postDataSave = {} as postModificationRequestI;
      postDataSave.contrapartidas = arrayCounterpartsSave;
      postDataSave.datos = arrayDataSave;
      postDataSave.idProyecto = Number(this.dataProjectID);
      postDataSave.observacion = this.JustificationText;

      this.serviceModRequest.postModificationRequestSave(postDataSave).subscribe(res => {
        let idSolicitud = res.data.idSolicitud;

        if (res.status == 200) {
          //guardar archivos
          let filesUp: boolean = this.rtnFile
          this.openSnackBar('Guardado Exitosamente', `Solicitud de modificación guardada con éxito.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
          if (this.useNewFile == true) {
            this.addFiles(idSolicitud);
          }
          this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);

        } else if (res.status == 423) {
          this.openSnackBar('Lo sentimos', res.message, 'error', `Generando archivo de errores "${res.data.FileName}".`);
          this.convertBase64ToFileDownload(res.data.FileAsBase64, res.data.FileName);
        }
      }, error => {

        if (error.status == 422) {
          let Data: string[] = [];
          Data = Object.values(error.error.data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', error.error.Message, 'error', erorsMessages);
        } else {
          this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
        }
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

      this.serviceModRequest.putModificationRequestSave(putDataSave).subscribe(res => {
        let idSolicitud = res.data.idSolicitud;

        if (res.status == 200) {
          //guardar archivos
          let filesUp: boolean = this.rtnFile
          this.openSnackBar('Guardado Exitosamente', `Solicitud de modificación actualizada y guardada con éxito.`, 'success');
          //Elimación de los registros en LocalStorage
          ProChartStorage.removeItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
          ProChartStorage.removeItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
          if (this.useNewFile == true) {
            this.addFiles(idSolicitud);
          }
          setTimeout(() => {
            this.getModificationRequet(Number(this.dataProjectID), Number(this.dataSolicitudModID));
            this.getModificationRequestByRequestId(+this.dataSolicitudModID, this.dataValidity, this.filterModificationRequest);
            this.ArrayDataStorage = [];
          }, 1000);

        } else if (res.status == 423) {
          this.openSnackBar('Lo sentimos', res.message, 'error', `Generando archivo de errores "${res.data.FileName}".`);
          this.convertBase64ToFileDownload(res.data.FileAsBase64, res.data.FileName);
        }
      }, error => {
        if (error.status == 422) {
          let Data: string[] = [];
          Data = Object.values(error.error.data);
          let erorsMessages = '';
          Data.map(item => {
            erorsMessages += item + '. ';
          });
          this.openSnackBar('Lo sentimos', error.error.Message, 'error', erorsMessages);
        } else {
          this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
        }
      });
    }
  }

  //Botón Enviar
  enviar() {
    let fromStorageArrayData = ProChartStorage.getItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
    let fromStorageCounters = ProChartStorage.getItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);

    if (this.dataSolicitudModID == '0') {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe guardar primero la solicitud para poder enviarla.`);
    } else if (fromStorageArrayData !== null) {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe guardar o eliminar los requerimientos nuevos.`);
    } else if (fromStorageCounters !== null) {
      this.openSnackBar('Lo sentimos', `No se puede enviar la solicitud`, 'error', `Debe guardar o eliminar las contrapartidas nuevas.`);
    } else if (this.StatusRequest == 'En Creación' || this.StatusRequest == 'En Ajuste') {

      let sendData = {
        idProyecto: this.dataProjectID,
        idSolicitud: this.dataSolicitudModID,
        vigencia: this.dataValidity
      }

      let TEXT_MESSAGE: string = ``;
      if (this.ProjectState === 'Anteproyecto') {
        TEXT_MESSAGE = `Se enviará la Solicitud de modificación si selecciona "SI"`;
      } else {
        TEXT_MESSAGE = `Se enviará la Solicitud de modificación con el año de vigencia ${this.dataValidity} si selecciona "SI"`;
      }

      //Alerta de confirmación
      Swal.fire({
        customClass: {
          confirmButton: 'swalBtnColor',
          denyButton: 'swalBtnColor'
        },
        title: '¿Está seguro que desea enviar la Solicitud?',
        text: `${TEXT_MESSAGE}`,
        showDenyButton: true,
        denyButtonText: 'NO',
        confirmButtonText: 'SI',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {

          this.serviceModRequest.putModificationRequestSend(sendData).subscribe(res => {
            if (res.status == 200) {
              this.openSnackBar('Enviado Exitosamente', `Solicitud de Modificación N° ${res.data.numSolicitud}. Enviada con éxito.`, 'success');
              //Elimación de los registros en LocalStorage
              ProChartStorage.removeItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
              ProChartStorage.removeItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
              ProChartStorage.removeItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
              ProChartStorage.removeItem(`arrayIdSources${this.dataProjectID}${this.dataSolicitudModID}`);
              this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
            } else if (res.status == 404) {
              let Data: string[] = [];
              Data = Object.values(res.Data);
              let erorsMessages = '';
              Data.map(item => {
                erorsMessages += item + '. ';
              });
              this.openSnackBar('Lo sentimos', res.Data.Message, 'error', erorsMessages);
            } else if (res.status == 400) {
              let Data: string[] = [];
              let erorsMessages = '';
              if (res.data != null) {
                Data = Object.values(res.data);
                Data.map(item => {
                  erorsMessages += item + '. ';
                });
              }
              this.openSnackBar('Lo sentimos', res.message, 'error', erorsMessages);
            }
          }, error => {
            this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
          });
        }
      });
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

      //Alerta de confirmación
      Swal.fire({
        customClass: {
          confirmButton: 'swalBtnColor',
          denyButton: 'swalBtnColor'
        },
        title: '¿Está seguro que desea enviar las revisiones?',
        text: `Se enviarán las revisiones de la Solicitud si selecciona "SI"`,
        showDenyButton: true,
        denyButtonText: 'NO',
        confirmButtonText: 'SI',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {

          this.serviceModRequest.putRevisionesEnviar(Revisiones).subscribe(res => {
            if (res.status == 200) {
              this.openSnackBar('Enviado Exitosamente', `Revisiones de la Solicitud de Modificación Enviadas con éxito.`, 'success');
              this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
            } else if (res.status == 400) {
              this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
            } else if (res.status == 404) {
              this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
            }
          }, error => {
            this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
          });
        }
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
      height: '580px',
      data: { title: title, message: message, type: type, message2: message2 },
    });

    dialogRef.afterClosed().subscribe((result: RevisionSend) => {
      if (result) {
        const Revisiones: RevisionSend = {
          accion: result.accion,
          comentarios: result.comentarios,
          idProject: Number(this.dataProjectID),
          idSolicitud: Number(this.dataSolicitudModID)
        }

        this.serviceModRequest.putRevisionesEnviar(Revisiones).subscribe(res => {
          if (res.status == 200) {
            this.openSnackBar('Enviado Exitosamente', `Revisiones de la Solicitud de modificación enviadas con éxito.`, 'success');
            this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
          } else if (res.status == 400) {
            this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
          } else if (res.status == 404) {
            this.openSnackBar('Lo sentimos', `No se puede enviar revisiones.`, 'error', `${res.message}.`);
          }
        }, error => {
          this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
        });
      }
    });
  }


  //Boton cancelar
  cancel() {
    this.CounterpartsDelete = [];
    this.RequerimentsDelete = [];
    ProChartStorage.removeItem(`dataTableItems${this.dataProjectID}${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayDatos${this.dataProjectID}${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayCounterparts${this.dataProjectID}${this.dataSolicitudModID}`);
    ProChartStorage.removeItem(`arrayIdSources${this.dataProjectID}${this.dataSolicitudModID}`);
    if (this.StatusRequest === 'En Creación' && this.AccessUser !== 'Revisor') {
      //Alerta de confirmación
      Swal.fire({
        customClass: {
          confirmButton: 'swalBtnColor',
          denyButton: 'swalBtnColor'
        },
        title: '¿Está seguro de eliminar la Solicitud?',
        text: 'Se eliminará la Solicitud de modificación si selecciona "SI"',
        showDenyButton: true,
        denyButtonText: 'NO',
        confirmButtonText: 'SI',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {

          this.serviceModRequest.deleteModificationRequest(Number(this.dataSolicitudModID)).subscribe(res => {
            if (res.status == 200) {
              this.openSnackBar('Acciones Canceladas', `Solicitud de modificación eliminada.`, 'success');
              this.router.navigate([`/WAPI/PAA/BandejaDeSolicitudes`]);
            }
          }, error => {
            this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuníquese con el administrador del sistema.`);
          });
        }
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
    } else if (this.AccessUser === 'Revisor') {
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

  //Convertir archivo de Base64 a .xlsx y descargarlo
  convertBase64ToFileDownload(base64String: string, fileName: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}`;
    link.click();
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