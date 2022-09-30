import { CurrencyPipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { dataSourceClasificacionesI, dataSourceRevisionesI, getAllDependenciesDataI, getAllSelectionModeDataI, getAllUNSPSCDataI, getInfoToCreateReqDataI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { PropertiesRequirementService } from 'src/app/Services/ServicesPAA/propertiesRequirement/properties-requirement.service';

export interface TableInfo {
  mes: number;
  vigenciaRecursos: number;
  auxiliar: number;
  detalleFuente: string;
  actividad: number;
  meta: string;
  fuente: string;
  fuenteMSPS: string;
  MGA: number;
  pospre: string;
  apropiacionDisponible: number;
  aumento: number;
  disminucion: number;
  apropiacionDefinitiva: number;
  compromisos: number;
  giros: number;
}

export interface TableCodigos {
  idCod: number;
  codigo: number;
  descripcion: string;
}

export interface TableRevisiones {
  fecha: string;
  usuario: string;
  area: string;
  concepto: string;
  observacion: string;
  revision: boolean;
}

const REVISION_DATA: TableRevisiones[] = [
  { fecha: '21-08-2022', usuario: 'Carmen Torres', area: 'Contrataciones', concepto: 'Cantidad de contratos', observacion: 'Se devuelve para ajuste de la cantidad de contratos solicitados', revision: true },
  { fecha: '23-08-2022', usuario: 'Raul gonzalez', area: 'Financiera', concepto: 'Campo XXXX', observacion: 'Modificar XXXX', revision: false }
];


const ELEMENT_DATA: TableInfo[] = [
  { mes: 1, vigenciaRecursos: 2022, auxiliar: 1061, detalleFuente: '012 - Aporte Ordinario', actividad: 1.6, meta: '01', fuente: '012', fuenteMSPS: '07', MGA: 1903023, pospre: 'O232020200', apropiacionDisponible: 60000000, aumento: 140000, disminucion: 0, apropiacionDefinitiva: 200000000, compromisos: 0, giros: 100000000 },
  { mes: 2, vigenciaRecursos: 2022, auxiliar: 1007, detalleFuente: '012 - Aporte Ordinario', actividad: 1.1, meta: '01', fuente: '007', fuenteMSPS: '07', MGA: 2301024, pospre: 'O232010100', apropiacionDisponible: 40000000, aumento: 0, disminucion: 10000000, apropiacionDefinitiva: 30000000, compromisos: 0, giros: 100000000 },
];

@Component({
  selector: 'app-properties-requirement',
  templateUrl: './properties-requirement.component.html',
  styleUrls: ['./properties-requirement.component.scss']
})
export class PropertiesRequirementComponent implements OnInit {
  dataRequirementID: string = '';
  dataProjectID: string = '';
  codProject: number = 0;
  nomProject: string = '';
  dependenciaRec: string = '';
  getInfoToProject = {} as getInfoToCreateReqDataI;
  allDependencies: any
  allSelectionMode: any
  allContractualAction: any;
  allReviewsArea: any;
  listDependencies: any;
  listSelcMode: any;
  listContacType: any;
  listAuxiliar: any;
  listFuentes: any;
  listActivities: any;
  listMGA: any;
  listPOSPRE: any;
  listUNSPSC: any;
  allProfile: any;
  dependencieFil!: string[];
  values: any;
  control = new FormControl('');
  filDependencies!: Observable<string[]>;
  filSelcMode!: Observable<string[]>;
  dependencieId: string = '';
  selcModeId: string = '';
  auxiliarId: string = '';
  fuenteId: string = '';
  activityId: string = '';
  MGAId: string = '';
  POSPREId: string = '';
  UNSPSCId: string = '';
  depDesValue: string = '';
  //variables localstorage
  dataTableCodigos = new Array();
  dataTableCodigo: any;
  dataTableClasificaciones = new Array();
  dataTableClasificacion: any;
  dataTableRevisiones = new Array();
  dataTableRevision: any;

  dependencieDes = new FormControl('');

  cantMeses: any[] = [
    { idMes: '01', nameMes: 'Enero' },
    { idMes: '02', nameMes: 'Febrero' },
    { idMes: '03', nameMes: 'Marzo' },
    { idMes: '04', nameMes: 'Abril' },
    { idMes: '05', nameMes: 'Mayo' },
    { idMes: '06', nameMes: 'Junio' },
    { idMes: '07', nameMes: 'Julio' },
    { idMes: '08', nameMes: 'Agosto' },
    { idMes: '09', nameMes: 'Septiembre' },
    { idMes: '10', nameMes: 'Octubre' },
    { idMes: '11', nameMes: 'Noviembre' },
    { idMes: '12', nameMes: 'Diciembre' },
  ]


  proRequirementeForm = new FormGroup({
    infoBasicaForm: this.formbuilder.group({
      codigoPro: new FormControl({ value: 0, disabled: true }),
      dependenciaOri: new FormControl({ value: '', disabled: true }),
      numeroReq: new FormControl(),
      dependenciaDes: new FormControl(),
      mesSeleccion: new FormControl(),
      mesOfertas: new FormControl(),
      mesContrato: new FormControl(),
      duracionMes: new FormControl(),
      duracionDias: new FormControl(),
      modalidadSel: new FormControl(),
      actuacionCont: new FormControl(),
      numeroCont: new FormControl(),
      tipoCont: new FormControl(),
      perfil: new FormControl(),
      valorHonMes: new FormControl(),
      cantidadCont: new FormControl(),
      descripcion: new FormControl()
    }),
    clasPresFinaForm: this.formbuilder.group({
      numModificacion: new FormControl({ value: '', disabled: true }),
      mes: new FormControl(),
      vigenciaRecu: new FormControl(),
      auxiliar: new FormControl(),
      dataFuente: new FormControl(),
      ftnMSPS: new FormControl({ value: '', disabled: true }),
      actividad: new FormControl(),
      meta: new FormControl({ value: '', disabled: true }),
      MGA: new FormControl(),
      POSPRE: new FormControl()
    }),
    codigosForm: this.formbuilder.group({
      codCategoria: new FormControl(),
      descCategoria: new FormControl({ value: '', disabled: true })
    }),
    initialAppro: this.formbuilder.group({
      vigencia0: new FormControl({ value: '2020', disabled: true }),
      valor0: new FormControl({ value: 20000000, disabled: true }),
      vigencia1: new FormControl({ value: '2021', disabled: true }),
      valor1: new FormControl({ value: 40000000, disabled: true }),
      vigencia2: new FormControl({ value: '2022', disabled: true }),
      valor2: new FormControl({ value: 60000000, disabled: true }),
      valorTotal: new FormControl({ value: 120000000, disabled: true })
    }),
    reviews:  this.formbuilder.group({
      area: new FormControl(),
      concepto: new FormControl(),
      observaciones: new FormControl
    })
  })



  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['mes', 'vigenciaRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  dataSource = ELEMENT_DATA;

  //INFORMACION PARA LA TABLA CODIGOS UNSPSC
  codigosColumns: string[] = ['codigoUNSPSC', 'descripcion', 'eliminar'];

  //INFORMACION PARA LA TABLA REVICIONES
  revisionesColumns: string[] = ['fecha', 'usuario', 'area', 'concepto', 'observacion', 'revision', 'eliminar'];
  dataRevisiones = REVISION_DATA;

  dataSourceCodigos!: MatTableDataSource<getAllUNSPSCDataI>;
  dataSourceClasificaciones!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceRevisiones!: MatTableDataSource<dataSourceRevisionesI>;

  constructor(
    public serviceProject: ProjectService,
    public serviceProRequirement: PropertiesRequirementService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private formbuilder: FormBuilder,
    private currencyPipe: CurrencyPipe
  ) { }

  ngAfterViewInit() {
    this.dataRequirementID = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    //console.log(+this.dataProjectID, +this.dataRequirementID)
    this.getInfoToCreateReq(+this.dataProjectID);
  }
  uploadDropdownLists() {
    this.getDependenciesByCod();
    this.getSelectionModeByCod();
    this.getAllContractualAction();
    this.getAllContacType();
    this.getAllProfile();
    this.getAuxiliarByCod();
    this.getFuentesBycod();
    this.getAllActivities();
    this.getMGAByCod();
    this.getPOSPREByCod();
    this.getUNSPSCByCod();
    this.getAllReviewsArea();
  }

  ngOnInit(): void {
    this.ngAfterViewInit();
    this.uploadDropdownLists();
    this.currencyInput();
  }

  currencyInput() {
    //use pipe to display currency
    this.proRequirementeForm.valueChanges.subscribe(form => {
      if (form.infoBasicaForm?.valorHonMes) {
        this.proRequirementeForm.controls.infoBasicaForm.patchValue({
          valorHonMes: this.currencyPipe.transform(form.infoBasicaForm?.valorHonMes.replace(/\D/g, '').replace(/^0+/, ''), "COP", 'symbol-narrow', '1.0-0')
        }, { emitEvent: false })
      }
    });
  }


  getInfoToCreateReq(projectId: number) {
    this.serviceProRequirement.getInfoToCreateReq(projectId).subscribe((dataProject) => {
      //console.log(data)
      this.getInfoToProject = dataProject.data;
      this.codProject = this.getInfoToProject.codigoProyecto;
      this.nomProject = this.getInfoToProject.nombreProyecto;
      this.dependenciaRec = this.getInfoToProject.dependenciaOrigen;
      this.proRequirementeForm.controls.infoBasicaForm.controls['codigoPro'].setValue(this.codProject);
      this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaOri'].setValue(this.dependenciaRec);
      //console.log(this.nomProject, this.codProject)
    })
  }


  getDependenciesByCod() {
    this.proRequirementeForm.controls.infoBasicaForm.controls.dependenciaDes.valueChanges.pipe(
      // debounceTime(1000), // Espera 1 segundo antes de emitir el valor del input
      distinctUntilChanged()  // Evita que se emita el valor si es igual al ultimo valor que se emitió
    ).subscribe(val => {
      this.serviceProRequirement.getDependenceElastic(val || '').subscribe((dataDependencie) => {
        this.listDependencies = dataDependencie.data;
        // console.log(this.dependencieFil)
        //console.log(dataDependencie)
      })
    }) || '';
  }

  getSelectionModeByCod() {
    this.proRequirementeForm.controls.infoBasicaForm.controls.modalidadSel.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getSelectionModeElastic(val || '').subscribe((dataSelcMode) => {
        this.listSelcMode = dataSelcMode.data;
        // console.log(this.listSelcMode)
      })
    }) || '';

  }

  getAllContractualAction() {
    this.serviceProRequirement.getAllContractualAction().subscribe((dataAction) => {
      this.allContractualAction = dataAction.data;
    })
  }
  getAllContacType() {
    this.serviceProRequirement.getAllContacType().subscribe((dataContratType) => {
      this.listContacType = dataContratType.data;
      //console.log(this.listContacType)
    })
  }
  getAllProfile() {
    this.serviceProRequirement.getAllProfile().subscribe((dataProfile) => {
      this.allProfile = dataProfile.data
    })
  }
  getAuxiliarByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.auxiliar.valueChanges.pipe(
      // debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getAuxiliarElastic(val || '').subscribe((dataAuxuliar) => {
        this.listAuxiliar = dataAuxuliar.data
      })
    }) || '';

  }
  getFuentesBycod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.dataFuente.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getFuentesElastic(val || '').subscribe((dataFuentes) => {
        this.listFuentes = dataFuentes.data
        // console.log(' this.listFuentes', this.listFuentes)
      }, (err) => {
        console.log('err', err)
        this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
          ftnMSPS: ''
        })
      })
    }) || '';
  }
  getAllActivities() {
    this.serviceProRequirement.getAllActivities(+this.dataProjectID).subscribe((dataActi) => {
      this.listActivities = dataActi.data
      //   console.log('actividades', this.listActivities)
    })
  }
  getMGAByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.MGA.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getMGAElastic(val).subscribe(dataMGA => {
        this.listMGA = dataMGA.data
        // console.log('dataMGA', this.listMGA)
      })
    })
  }
  getPOSPREByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.POSPRE.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getPOSPREElastic(val).subscribe(dataPOSPRE => {
        this.listPOSPRE = dataPOSPRE.data
        console.log('dataPOSPRE', this.listPOSPRE)
      })
    })
  }
  getUNSPSCByCod() {
    this.proRequirementeForm.controls.codigosForm.controls.codCategoria.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getUNSPSCElastic(val).subscribe(dataUNSPSC => {
        this.listUNSPSC = dataUNSPSC.data
        console.log('dataUNSPSC', this.listUNSPSC)
      })
    })
  }
  getAllReviewsArea() {
    this.serviceProRequirement.getAllReviewsArea().subscribe(dataReviews => {
      this.allReviewsArea = dataReviews.data
      // console.log('dataReviews',dataReviews.data)

    })
  }
  cancel() {
    this.router.navigate(['/PAA/Requerimientos/' + this.dataProjectID])
  }

  saveForm() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].setValue(this.dependencieId);
    this.proRequirementeForm.controls.infoBasicaForm.controls['modalidadSel'].setValue(this.selcModeId);
    console.log(this.proRequirementeForm.value)
  }

  //funciones para retornar el valor al autocomplete
  displayFn(value: any) {
    //console.log('value', value)
    return value ? value.codigo : ''
  }
  displayFnAux(value: any) {
    // console.log('value', value)
    return value ? value.codigoAuxiliar : ''
  }
  displayFnFte(value: any) {
    // console.log('value', value)
    return value ? value.codigoFuente : ''
  }
  displayFnAct(value: any) {
    //  console.log('value', value)
    return value ? value.codigoAct : ''
  }
  displayFnMGA(value: any) {
    console.log('value', value)
    return value ? value.codigoMGA : ''
  }
  displayFnPOSPRE(value: any) {
    console.log('value', value)
    return value ? value.codPOSPRE : ''
  }
  displayFnCod(value: any) {
    console.log('value', value)
    return value ? value.codigoUNSPSC : ''
  }
  displayFnArea(value: any) {
    console.log('value', value)
    return value ? value.nombre : ''
  }
  //funcion para obtener el id del autocomplete
  onSelectionChange(event: any, tipo: string) {
    if (tipo === 'dependenciaDes') {
      this.dependencieId = event.option.value.dependencia_ID;
      // console.log('onSelectionChange dependenciaDes', event.option.value);
      this.depDesValue = event.option.value
      //console.log('onSelectionChange dependenciaDes', event.option.value.dependencia_ID);
      // this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].setValue( event.option.value.dependencia_ID);
      // this.proRequirementeForm.controls.infoBasicaForm.patchValue({
      //   dependenciaDes: event.option.value.dependencia_ID,
      // })
    }
    if (tipo === 'modalidadSel') {
      //  console.log('onSelectionChange modalidadSel', event.option.value);
      this.selcModeId = event.option.value.modalidad_Sel_ID;
      // this.proRequirementeForm.controls.infoBasicaForm.patchValue({
      //   modalidadSel: event.option.value.modalidad_Sel_ID,
      // })
    }
    if (tipo == 'auxiliar') {
      console.log('onSelectionChange auxiliar', event.option.value);
      // this.auxiliarId = event.option.value.auxiliarId;
    }
    if (tipo == 'dataFuente') {
      // console.log('onSelectionChange dataFuente', event.option.value);
      this.fuenteId = event.option.value.fuente_ID
      // console.log('onSelectionChange dataFuente', event.option.value.fuenteMSPS);
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        ftnMSPS: event.option.value.fuenteMSPS
      })
    }
    if (tipo == 'actividad') {
      this.activityId = event.value.actividad_ID
      //console.log( this.activityId ,'actividad',event)
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        meta: event.value.metaODS
      })
    }
    if (tipo == 'MGA') {
      this.MGAId = event.option.value.mgA_ID
    }
    if (tipo == 'POSPRE') {
      this.POSPREId = event.option.value.pospre_ID
    }
    if (tipo == 'codCategoria') {
      this.UNSPSCId = event.option.value.unspsC_ID
      this.proRequirementeForm.controls.codigosForm.patchValue({
        descCategoria: event.option.value.descripcion
      })
      // console.log('codCategoria', event)
    }

  }
  reloadDataTbl(value: any, type: string) {
    var objectsFromStorage = JSON.parse(value || '')
    if (type == 'codigos') {
      this.dataSourceCodigos = new MatTableDataSource(objectsFromStorage);
    }
    if (type == 'clasificaciones') {
      this.dataSourceClasificaciones = new MatTableDataSource(objectsFromStorage)
    }
    if (type == 'revisiones') {
      this.dataSourceRevisiones = new MatTableDataSource(objectsFromStorage)
      
    }
  }

  addDataTbl(type: string) {
    if (type == 'clasificaciones') {
      //console.log('addclasPresFina', this.proRequirementeForm.controls.clasPresFinaForm.value)
      this.dataTableClasificacion = this.proRequirementeForm.controls.clasPresFinaForm.value
      this.dataTableClasificaciones.push(this.dataTableClasificacion)
      var stringToStore = JSON.stringify(this.dataTableClasificaciones);
      ProChartStorage.setItem("dataTableClacificaciones", stringToStore);
      var fromStorage = ProChartStorage.getItem("dataTableClacificaciones");
      this.reloadDataTbl(fromStorage, 'clasificaciones');
    }
    if (type == 'codigos') {
      this.dataTableCodigo = this.proRequirementeForm.controls.codigosForm.controls.codCategoria.value
      this.dataTableCodigos.push(this.dataTableCodigo)
      var stringToStore = JSON.stringify(this.dataTableCodigos);
      ProChartStorage.setItem("dataTableCodigos", stringToStore);
      var fromStorage = ProChartStorage.getItem("dataTableCodigos");
      this.reloadDataTbl(fromStorage, 'codigos');
    }
    if (type == 'revisiones') {
      moment.locale("es");
      const fechaActual = Date.now();
      let dataRevision = {} as dataSourceRevisionesI
      // dataRevision.revisionID = 1
      // dataRevision.revisionID = dataRevision.revisionID + 1;
      dataRevision.fecha = moment(fechaActual).format("DD-MM-YYYY");;
      dataRevision.usuario = 'Ususario Prueba';
      dataRevision.area = this.proRequirementeForm.controls.reviews.controls.area.value;
      dataRevision.concepto = this.proRequirementeForm.controls.reviews.controls.concepto.value;
      dataRevision.observacion = this.proRequirementeForm.controls.reviews.controls.observaciones.value || '';
      dataRevision.revision = false;
      this.dataTableRevision = dataRevision;
      this.dataTableRevisiones.push(this.dataTableRevision);
      var stringToStore = JSON.stringify(this.dataTableRevisiones);
      ProChartStorage.setItem("dataTableRevisiones", stringToStore);
      var fromStorage = ProChartStorage.getItem("dataTableRevisiones");
      //console.log('revisiones fromStorage', fromStorage)
      this.reloadDataTbl(fromStorage, 'revisiones');
    }
  }

  getCodeUNSPSC(valueToFind: string) {
    var fromStorage = ProChartStorage.getItem("dataTableCodigos");
    var objectsFromStorage = JSON.parse(fromStorage || '')
    var toFind = objectsFromStorage.filter(function (obj: any) {
      return obj.codigoUNSPSC == valueToFind;
    });
  }

  removeDataTbl(valueToFind: any, type: string) {
   
    if (type == 'clasificaciones') {
      console.log('clasificaciones', valueToFind)
      return
      var fromStorage = ProChartStorage.getItem("dataTableClacificaciones");
      var objectsFromStorage = JSON.parse(fromStorage || '')
      var toFind = objectsFromStorage.filter(function (obj: any) {
        return obj.unspsC_ID == valueToFind;
      });
      // find the index of the item to delete
      var index = objectsFromStorage.findIndex((x: any) => x.unspsC_ID === valueToFind);
      if (index >= 0) {
        this.dataTableClasificaciones.splice(index, 1);
        objectsFromStorage.splice(index, 1);
        var stringToStore = JSON.stringify(objectsFromStorage);
        ProChartStorage.setItem("dataTableClacificaciones", stringToStore);
        this.reloadDataTbl(stringToStore, 'clasificaciones');
      }
    }
    if (type == 'codigos') {
      var fromStorage = ProChartStorage.getItem("dataTableCodigos");
      var objectsFromStorage = JSON.parse(fromStorage || '')
      var toFind = objectsFromStorage.filter(function (obj: any) {
        return obj.unspsC_ID == valueToFind;
      });
      // find the index of the item to delete
      var index = objectsFromStorage.findIndex((x: any) => x.unspsC_ID === valueToFind);
      if (index >= 0) {
        this.dataTableCodigos.splice(index, 1);
        //  console.log('arreglo rem,ove',this.dataTableCodigos)
        objectsFromStorage.splice(index, 1);
        var stringToStore = JSON.stringify(objectsFromStorage);
        ProChartStorage.setItem("dataTableCodigos", stringToStore);
        this.reloadDataTbl(stringToStore, 'codigos');
      }
    }
    if (type == 'revisiones') {
      console.log('clasificaciones', valueToFind)
      return
      var fromStorage = ProChartStorage.getItem("dataTableCodigos");
      var objectsFromStorage = JSON.parse(fromStorage || '')
      var toFind = objectsFromStorage.filter(function (obj: any) {
        return obj.unspsC_ID == valueToFind;
      });
      // find the index of the item to delete
      var index = objectsFromStorage.findIndex((x: any) => x.unspsC_ID === valueToFind);
      if (index >= 0) {
        this.dataTableCodigos.splice(index, 1);
        //  console.log('arreglo rem,ove',this.dataTableCodigos)
        objectsFromStorage.splice(index, 1);
        var stringToStore = JSON.stringify(objectsFromStorage);
        ProChartStorage.setItem("dataTableCodigos", stringToStore);
        this.reloadDataTbl(stringToStore, 'revisiones');
      }
    }


  }

}

var ProChartStorage = {
  getItem: function (key: any) {
    return localStorage.getItem(key);
  },
  setItem: function (key: any, value: any) {
    console.log("prochart setItem")
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







