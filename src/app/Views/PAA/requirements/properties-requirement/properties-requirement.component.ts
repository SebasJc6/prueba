import { CurrencyPipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { postDataModificationsI, postDataModifRequerimentsI, postDataModReqI, postModificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { dataSourceClasificacionesI, dataSourceRevisionesI, getAllAuxiliarDataI, getAllUNSPSCDataI, getInfoToCreateReqDataI, saveDataEditDatosI, requerimientoI, saveDataEditI, verifyDatacompleteI, verifyDataSaveI, getDataTemporalModifiedI, getAllMGADataI, getAllPOSPREDataI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { deleteReviewsI, postReviewsI, putUpdateReviewsI, reviewsI, revisionesI } from 'src/app/Models/ModelsPAA/propertiesRequirement/Reviews/reviews.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { InitialApropriationService } from 'src/app/Services/ServicesPAA/propertiesRequirement/initialApropriation/initial-apropriation.service';
import { PropertiesRequirementService } from 'src/app/Services/ServicesPAA/propertiesRequirement/properties-requirement.service';
import { ReviewsService } from 'src/app/Services/ServicesPAA/propertiesRequirement/reviews/reviews.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import { BudgetModificationComponent } from './budget-modification/budget-modification.component';
import { SharedService } from 'src/app/Services/ServicesPAA/shared/shared.service';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-properties-requirement',
  templateUrl: './properties-requirement.component.html',
  styleUrls: ['./properties-requirement.component.scss']
})
export class PropertiesRequirementComponent implements OnInit {
  dataRequirementID: string = '';
  reqID: number = 0;
  dataRequirementNum: string = '';
  dataSolicitudID: string = '';
  dataProjectID: string = '';
  codProject: number = 0;
  nomProject: string = '';
  dependenciaRec: any
  typePage: string = '';
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
  allConcepts: any;
  dependencieFil!: string[];
  values: any;
  control = new FormControl('');
  filDependencies!: Observable<string[]>;
  filSelcMode!: Observable<string[]>;
  filteredAuxiliar!: Observable<getAllAuxiliarDataI[]>;
  allAuxiliar!: getAllAuxiliarDataI[];
  dependencieId: string = '';
  selcModeId: string = '';
  auxiliarId: string = '';
  fuenteId: string = '';
  activityId: string = '';
  MGAId: string = '';
  POSPREId: string = '';
  UNSPSCId: string = '';
  depDesValue: string = '';
  disabledAdicion: boolean = false;
  disabledInicial: boolean = false;
  viewVersion: boolean = false;
  viewVersionMod: boolean = false;
  viewBtnVersion: boolean = true;
  viewActionsBtns: boolean = false;
  viewActionCancel: boolean = false;
  //variables errores input
  errorNumReq: boolean = false;
  errorVerifyNumReq: boolean = false;
  msjVerifyNumReq: string = '';
  errorDependencia: boolean = false;
  errorMesSeleccion: boolean = false;
  errorMesOferta: boolean = false;
  errorMesContrato: boolean = false;
  errorDuratioMes: boolean = false;
  errorDurationDia: boolean = false;
  errorModalidad: boolean = false;
  errorActuacion: boolean = false;
  errorNumContrato: boolean = false;
  errorTipContrato: boolean = false;
  errorPerfil: boolean = false;
  errorValorMes: boolean = false;
  errorRangeSararial: boolean = false;
  errorCantContrato: boolean = false;
  errorDescripcionCont: boolean = false;
  errorMes: boolean = false;
  errorVigRec: boolean = false;
  errorAux: boolean = false;
  errorFuentes: boolean = false;
  errorActi: boolean = false;
  errorMGA: boolean = false;
  errorPOSPRE: boolean = false;
  errorCodigos: boolean = false;
  errorArea: boolean = false;
  errorConcepto: boolean = false;
  errorObservaciones: boolean = false;
  msjVerifyRangeSararial: string = '';
  formEditRequirement: boolean = false;
  loading: boolean = false;
  btnViewBtn: boolean = false;
  //variables localstorage
  dataTableCodigos = new Array();
  dataTableCodigo: any;
  dataTableClasificaciones = new Array();
  cadenasPresupuestalesTemporal = new Array();
  cadenasPresupuestalesVerAct = new Array();
  cadenasPresupuestalesVerRew = new Array();
  codigosTemporal = new Array();
  codigosVerAct = new Array();
  codigosVerRew = new Array();
  dataTableClasificacion: any;
  dataTableRevisiones = new Array();
  dataTableRevision: any;
  dataClasificacion = new Array()
  dataCodigos = new Array()
  reviewsUp = new Array()
  reviewsUpTemporal = new Array()
  reviewsCheck = new Array()
  reviewsAdd = new Array()
  dependencieDes = new FormControl('');
  idPerfil = 0
  formVerify = {} as verifyDataSaveI;
  formVerifyComplete = {} as verifyDatacompleteI;
  formModificationRequest = {} as saveDataEditI
  viewErrorDiaMax: boolean = false;
  //valores modififcados
  numeroRequerimientoModified?: boolean;
  dependenciaDestinoModified?: boolean;
  mesEstimadoInicioSeleccionModified?: boolean;
  mesEstimadoPresentacionModified?: boolean;
  mesEstmadoInicioEjecucionModified?: boolean;
  duracionDiasModified?: boolean;
  duracionMesModified?: boolean;
  modalidadSeleccionModified?: boolean;
  actuacionModified?: boolean;
  numeroDeContratoModified?: boolean;
  anioContratoModified?: boolean;
  tipoContratoModified?: boolean;
  perfilModified?: boolean;
  honorariosModified?: boolean;
  cantidadDeContratosModified?: boolean;
  descripcionModified?: boolean;
  cadenaNueva?: boolean;
  aumentoModified?: boolean;
  disminucionModified?: boolean;
  unspscNew?: boolean;
  numReqDisabled: boolean = true;
  mgp: string = '';

  years: number[] = []
  mgaValue = {} as getAllMGADataI;
  pospreValue = {} as getAllPOSPREDataI;
  initialAppYaers: number[] = []
  errInitialAppYaers: boolean = false;
  msjInitialAppYaers: any;

  isDataTemporal: boolean = false;

  idDisabeldActividad: boolean = true;
  //variables actuacion
  numContratoTmp: string = '';
  anioContratoTmp: number = 0;
  tipoContratoTmp: number = 0;
  perfilTmp: number = 0;
  honorariosTmp: number = 0;

  cantMeses: any[] = [
    //  { idMes: '0', nameMes: ' ' },
    { idMes: '1', nameMes: 'Enero' },
    { idMes: '2', nameMes: 'Febrero' },
    { idMes: '3', nameMes: 'Marzo' },
    { idMes: '4', nameMes: 'Abril' },
    { idMes: '5', nameMes: 'Mayo' },
    { idMes: '6', nameMes: 'Junio' },
    { idMes: '7', nameMes: 'Julio' },
    { idMes: '8', nameMes: 'Agosto' },
    { idMes: '9', nameMes: 'Septiembre' },
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
      anioContrato: new FormControl(),
      tipoCont: new FormControl(),
      perfil: new FormControl(),
      valorHonMes: new FormControl(),
      cantidadCont: new FormControl(),
      descripcion: new FormControl()
    }),
    clasPresFinaForm: this.formbuilder.group({
      numModificacion: new FormControl({ value: 0, disabled: true }),
      mes: new FormControl(),
      anioVigRecursos: new FormControl(),
      auxiliar: new FormControl(),
      fuente: new FormControl(),
      ftnMSPS: new FormControl({ value: '', disabled: true }),
      actividad: new FormControl(),
      meta: new FormControl({ value: '', disabled: true }),
      mga: new FormControl(),
      pospre: new FormControl()
    }),
    codigosForm: this.formbuilder.group({
      codCategoria: new FormControl(),
      descCategoria: new FormControl({ value: '', disabled: true })
    })

  })

  initialAppro = new FormGroup({
    anio_Vigencia: new FormControl(),
    valorApropiacionAnio: new FormControl({ value: '$0', disabled: true }),
    valorApropiacion_Final: new FormControl({ value: '$0', disabled: true }),
    valorApropiacion_Incial: new FormControl({ value: '$0', disabled: true }),
  })
  reviews = new FormGroup({
    area: new FormControl(),
    concepto: new FormControl(),
    observaciones: new FormControl(),
  })

  versionActualForm = new FormGroup({
    codigoProAct: new FormControl({ value: 0, disabled: true }),
    dependenciaOriAct: new FormControl({ value: '', disabled: true }),
    numeroReqAct: new FormControl({ value: '', disabled: true }),
    dependenciaDesAct: new FormControl({ value: {}, disabled: true }),
    mesSeleccionAct: new FormControl({ value: '', disabled: true }),
    mesOfertasAct: new FormControl({ value: '', disabled: true }),
    mesContratoAct: new FormControl({ value: '', disabled: true }),
    duracionMesAct: new FormControl({ value: 0, disabled: true }),
    duracionDiasAct: new FormControl({ value: 0, disabled: true }),
    modalidadSelAct: new FormControl({ value: {}, disabled: true }),
    actuacionContAct: new FormControl({ value: 0, disabled: true }),
    numeroContAct: new FormControl({ value: '', disabled: true }),
    anioContratoAct: new FormControl({ value: 0, disabled: true }),
    tipoContAct: new FormControl({ value: 0, disabled: true }),
    perfilAct: new FormControl({ value: 0, disabled: true }),
    valorHonMesAct: new FormControl({ value: '', disabled: true }),
    cantidadContAct: new FormControl({ value: 0, disabled: true }),
    descripcionAct: new FormControl({ value: '', disabled: true }),


  })

  versionReviewForm = new FormGroup({
    codigoProRew: new FormControl({ value: 0, disabled: true }),
    dependenciaOriRew: new FormControl({ value: '', disabled: true }),
    numeroReqRew: new FormControl({ value: '', disabled: true }),
    dependenciaDesRew: new FormControl({ value: {}, disabled: true }),
    mesSeleccionRew: new FormControl({ value: '', disabled: true }),
    mesOfertasRew: new FormControl({ value: '', disabled: true }),
    mesContratoRew: new FormControl({ value: '', disabled: true }),
    duracionMesRew: new FormControl({ value: 0, disabled: true }),
    duracionDiasRew: new FormControl({ value: 0, disabled: true }),
    modalidadSelRew: new FormControl({ value: {}, disabled: true }),
    actuacionContRew: new FormControl({ value: 0, disabled: true }),
    numeroContRew: new FormControl({ value: '', disabled: true }),
    anioContratoRew: new FormControl({ value: 0, disabled: true }),
    tipoContRew: new FormControl({ value: 0, disabled: true }),
    perfilRew: new FormControl({ value: 0, disabled: true }),
    valorHonMesRew: new FormControl({ value: '', disabled: true }),
    cantidadContRew: new FormControl({ value: 0, disabled: true }),
    descripcionRew: new FormControl({ value: '', disabled: true }),


  })
  submitted = false;
  public selectedIndex = 0;
  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['mes', 'anioVigRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  displayedColumnsAct: string[] = ['mes', 'anioVigRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  displayedColumnsRew: string[] = ['mes', 'anioVigRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  //INFORMACION PARA LA TABLA CODIGOS UNSPSC
  codigosColumns: string[] = ['codigoUNSPSC', 'descripcion', 'eliminar'];
  codigosColumnsAct: string[] = ['codigoUNSPSC', 'descripcion'];
  codigosColumnsRew: string[] = ['codigoUNSPSC', 'descripcion'];
  //INFORMACION PARA LA TABLA REVICIONES
  revisionesColumns: string[] = ['fecha', 'usuario', 'area', 'concepto', 'observacion', 'revision', 'eliminar'];
  revisionesColumnsView: string[] = ['fecha', 'usuario', 'area', 'concepto', 'observacion'];
  //Objeto con la informacion de acceso del Usuario
  AccessUser: string = '';
  viewsReviews: boolean = false;
  viewsBtnReviews: boolean = false;
  viewsSeccionReviews: boolean = false;
  viewsFormReviews: boolean = false;
  viewVersionReview: boolean = false;
  viewTableReviews: boolean = false;
  viewTableReviewsEdit: boolean = false;
  statusReq: string = '';
  dataSourceCodigos!: MatTableDataSource<getAllUNSPSCDataI>;
  dataSourceCodigosAct!: MatTableDataSource<getAllUNSPSCDataI>;
  dataSourceClasificaciones!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceClasificacionesAct!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceRevisiones!: MatTableDataSource<dataSourceRevisionesI>;
  dataSourceRevisionesView!: MatTableDataSource<dataSourceRevisionesI>;
  dataSourceClasificacionesRew!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceCodigosRew!: MatTableDataSource<getAllUNSPSCDataI>;
  //variables para errores genericos
  genericNumReq: boolean = false;
  genericDependenciaDes: boolean = false;
  genericMesSeleccion: boolean = false;
  genericMesOfertas: boolean = false;
  genericMesContrato: boolean = false;
  genericDuracionMes: boolean = false;
  genericDuracionDias: boolean = false;
  genericModalidadSel: boolean = false;
  genericActuacionCont: boolean = false;
  genericNumeroCont: boolean = false;
  genericTipoCont: boolean = false;
  genericPerfil: boolean = false;
  genericValorHonMes: boolean = false;
  genericCantidadCont: boolean = false;
  genericDescripcion: boolean = false;
  genericCodigos: boolean = false;
  genericClasificaciones: boolean = false;

  constructor(
    public serviceProject: ProjectService,
    public serviceProRequirement: PropertiesRequirementService,
    public serviceModRequest: ModificationRequestService,
    public servicesinitialApp: InitialApropriationService,
    public serviceReviews: ReviewsService,
    public router: Router, @Inject(DOCUMENT) private document: Document,
    private activeRoute: ActivatedRoute,
    private formbuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    public sharedSrv: SharedService
  ) { }

  ngAfterViewInit() {
    this.dataSolicitudID = this.activeRoute.snapshot.paramMap.get('idSol') || '';
    this.dataRequirementID = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.typePage = this.activeRoute.snapshot.paramMap.get('type') || '';
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
    this.getMGAByCod();
    this.getPOSPREByCod();
    this.getUNSPSCByCod();
    this.getAllConcepts();
    this.verifyNumReq();
    this.verifyRangeSararial();
    this.valuePerfil();

  }

  currencyInputAppro() {
    //use pipe to display currency
    this.initialAppro.valueChanges.subscribe(form => {
      if (form.valorApropiacion_Incial) {
        this.initialAppro.patchValue({
          valorApropiacion_Incial: this.assignCurrencyPipe(form.valorApropiacion_Incial)
        }, { emitEvent: false })
      }
      if (form.valorApropiacionAnio) {
        this.initialAppro.patchValue({
          valorApropiacionAnio: this.assignCurrencyPipe(form.valorApropiacionAnio)
        }, { emitEvent: false })
      }
      if (form.valorApropiacion_Final) {
        this.initialAppro.patchValue({
          valorApropiacion_Final: this.assignCurrencyPipe(form.valorApropiacion_Final)
        }, { emitEvent: false })
      }
    });
  }

  //Función para asignar formato de moneda a un numero y retorna el numero formatrado
  assignCurrencyPipe(number: string) {
    const NUMBER_ASSIGN = this.currencyPipe.transform(number.replace(/\D/g, '').replace(/^-1+/, ''), 'COP', 'symbol-narrow', '1.0-0');
    return NUMBER_ASSIGN;
  }

  ngOnInit(): void {
    this.currencyInputAppro();
    ProChartStorage.removeItem('dataTableClacificaciones')
    ProChartStorage.removeItem('dataTableCodigos')
    ProChartStorage.removeItem('dataTableRevisiones')
    this.mgp = sessionStorage.getItem('mgp') || '';
    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();

    // this.loading = true;
    this.ngAfterViewInit();
    this.uploadDropdownLists();
    this.currencyInput();
    this.valueRequired();


    this.serviceModRequest.getModificationRequestByRequest(+this.dataProjectID, +this.dataSolicitudID).subscribe((data) => {
      this.statusReq = data.data.solicitud_Estado || '';

      if (this.typePage == 'Vista') {
        this.viewBtnVersion = false;
        this.viewVersion = true;
        this.viewActionCancel = true;
        this.getDataAprobad(+this.dataProjectID, +this.dataRequirementID);

      } else if (this.typePage == 'Nuevo') {
        this.numReqDisabled = false;
        if (this.AccessUser != 'Revisor') {
          this.dataRequirementNum = this.dataRequirementID;
          this.viewBtnVersion = false;
          this.viewVersionMod = true;
        }
      } else if (this.typePage == 'En Ajuste') {
        if (this.AccessUser == 'Referente_PAA') {
          this.viewTableReviews = true;
          this.getAllReviews(+this.dataRequirementID)
          this.getAllDataTemporal(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
          this.viewVersionMod = true;
          this.viewsReviews = false;
          this.errorVerifyNumReq = false;
          this.viewsSeccionReviews = true;
          this.viewsFormReviews = false;
          this.viewTableReviewsEdit = false;
        }
      } else if (this.typePage == 'Editar') {
        if (this.AccessUser == 'Referente_PAA') {
          if (this.statusReq == 'En Revisión') {
            this.getDataConsulta(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
            this.viewVersionMod = false;
            this.viewsReviews = true;
            this.errorVerifyNumReq = false;
            this.btnViewBtn = false;
          }
          if (this.statusReq == 'En Creación' || this.statusReq == 'En Ajuste') {
            this.getAllDataTemporal(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
            this.viewVersionMod = true;
            this.viewsReviews = false;
            this.errorVerifyNumReq = false;
            this.viewsSeccionReviews = true;
            this.viewTableReviewsEdit = false;
            this.viewTableReviews = true;
            this.getAllReviews(+this.dataRequirementID)

          }
          if (this.statusReq == 'Aprobada' || this.statusReq == 'Rechazada') {
            this.getDataConsulta(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
            this.viewVersionMod = false;
            this.viewsReviews = true;
            this.errorVerifyNumReq = false;
          }

        } else if (this.AccessUser == 'Referente_Planeacion') {
          if (this.statusReq == 'En Creación') {
            this.getAllDataTemporal(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
            this.viewVersionMod = true;
            this.viewsReviews = false;
            this.errorVerifyNumReq = false;
          } else if (this.statusReq == 'En Revisión') {
            this.getAllReviews(+this.dataRequirementID)
            this.getDataConsulta(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
            this.viewVersionMod = false;
            this.viewsReviews = true;
            this.errorVerifyNumReq = false;
            this.btnViewBtn = false;
            this.viewsSeccionReviews = true;
            this.viewsFormReviews = false;
            this.viewTableReviewsEdit = false;
            this.viewTableReviews = true;
          } else {
            this.getDataConsulta(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
            this.viewVersionMod = false;
            this.viewsReviews = true;
            this.errorVerifyNumReq = false;
          }
        } else if (this.AccessUser == 'Revisor') {
          this.getAllReviews(+this.dataRequirementID)
          this.getDataConsulta(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
          this.viewVersionMod = false;
          this.viewsReviews = true;
          this.errorVerifyNumReq = false;
          this.btnViewBtn = true;
          if (this.statusReq == 'En Creación') {
            this.viewsSeccionReviews = false;
          } else if (this.statusReq == 'En Revisión') {
            this.viewsSeccionReviews = true;
            this.viewsFormReviews = true;
            this.viewTableReviewsEdit = true;
            this.viewTableReviews = false;
            this.getAllReviewsArea();
          }
          else {
            this.viewsSeccionReviews = true;
            this.viewsFormReviews = false;
            this.viewTableReviewsEdit = true;
            this.viewTableReviews = false;
          }
          this.viewVersionMod = false;
          this.viewsReviews = true;
          this.errorVerifyNumReq = false;
        }
      } else if (this.typePage == 'Ajuste') {
        if (this.AccessUser == 'Referente_PAA') {
          this.getAllDataTemporal(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
          this.viewVersionMod = true;
          this.viewsReviews = false;
          this.errorVerifyNumReq = false;
          this.viewsSeccionReviews = true;
          this.viewTableReviewsEdit = false;
          this.viewTableReviews = true;
          this.getAllReviews(+this.dataRequirementID)
        }
      }
    });



  }

  currencyInput() {
    //use pipe to display currency
    this.proRequirementeForm.valueChanges.subscribe(form => {
      if (form.infoBasicaForm?.valorHonMes) {
        this.proRequirementeForm.controls.infoBasicaForm.patchValue({
          // valorHonMes: this.currencyPipe.transform(form.infoBasicaForm?.valorHonMes.replace(/\D/g, '').replace(/^0+/, ''), "COP", 'symbol-narrow', '1.0-0') || ''
        }, { emitEvent: false })
      }
    });
  }


  valueRequired() {
    this.reviews.controls.observaciones.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorObservaciones = value.length > 0 ? false : true;
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.dependenciaDes.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDependencia = value.length > 0 ? false : true;
      this.genericDependenciaDes = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.mesSeleccion.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorMesSeleccion = value.length > 0 ? false : true;
      this.genericMesSeleccion = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.mesOfertas.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorMesOferta = value.length > 0 ? false : true;
      this.genericMesOfertas = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.mesContrato.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorMesContrato = false
      this.genericMesContrato = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.duracionMes.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDuratioMes = false
      this.genericDuracionMes = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.duracionDias.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDurationDia = false
      this.viewErrorDiaMax = false
      this.genericDuracionDias = false

      if (value > 29) {
        this.viewErrorDiaMax = true
      }
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.modalidadSel.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorModalidad = false
      this.genericModalidadSel = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.actuacionCont.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorActuacion = false
      this.genericActuacionCont = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.numeroCont.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.proRequirementeForm.controls.infoBasicaForm.controls.anioContrato.setValue('');
      this.genericNumeroCont = false
      if (value != '') {
        this.serviceProRequirement.getAniosBycontrato(value).subscribe(res => {
          this.years = res.data

        })
      } else {

      }
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.anioContrato.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      let numCont = this.proRequirementeForm.controls.infoBasicaForm.controls.numeroCont.value

      if (value != null && value != '') {
        this.serviceProRequirement.getDataAuto(numCont, value).subscribe(res => {
          this.tipoContratoTmp = res.data.tipoContrato_ID
          this.perfilTmp = res.data.perfil_ID
          this.honorariosTmp = res.data.valorHonorarios
          this.proRequirementeForm.controls.infoBasicaForm.controls.tipoCont.setValue(this.tipoContratoTmp)
          this.proRequirementeForm.controls.infoBasicaForm.controls.perfil.setValue(this.perfilTmp)
          this.proRequirementeForm.controls.infoBasicaForm.controls.valorHonMes.setValue(this.honorariosTmp)
        })
      }
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.tipoCont.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.genericTipoCont = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.perfil.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.genericPerfil = false
      if (this.proRequirementeForm.controls.infoBasicaForm.controls.valorHonMes.value != null && this.proRequirementeForm.controls.infoBasicaForm.controls.valorHonMes.value != undefined) {
        let valueHonorario = this.proRequirementeForm.controls.infoBasicaForm.controls.valorHonMes.value
        if (valueHonorario == null || valueHonorario == 0) { } else
          if (value != 0) {
            //obtener ano actual
            let anioActual = new Date().getFullYear();
            // console.log('anioActual2', anioActual)
            this.serviceProRequirement.verifyRangeSararial(value, valueHonorario, anioActual).subscribe(data => {
              if (data.data == false) {
                this.errorRangeSararial = true;
                this.msjVerifyRangeSararial = data.message
              } else {
                this.errorRangeSararial = false;
                this.msjVerifyRangeSararial = data.message
              }
            })
          }

      }
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.cantidadCont.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorCantContrato = false
      this.genericCantidadCont = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.descripcion.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDescripcionCont = false
      this.genericDescripcion = false
    })
    this.proRequirementeForm.controls.clasPresFinaForm.controls.auxiliar.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      if(value != null && value != undefined){
        this.getAllActivities(value.auxiliar_ID);
        this.idDisabeldActividad = false;
      }
      

    })




  }
  getInfoToCreateReq(projectId: number) {
    this.serviceProRequirement.getInfoToCreateReq(projectId).subscribe((dataProject) => {
      this.getInfoToProject = dataProject.data;
      this.codProject = this.getInfoToProject.codigoProyecto;
      this.nomProject = this.getInfoToProject.nombreProyecto;
      let depOrige = this.getInfoToProject.dependenciaOrigen.codigo
      this.dependenciaRec = depOrige
      this.proRequirementeForm.controls.infoBasicaForm.controls['codigoPro'].setValue(this.codProject);
      let concatDepe = this.getInfoToProject.dependenciaOrigen.codigo.concat(' ' + this.getInfoToProject.dependenciaOrigen.detalle)
      this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaOri'].setValue(concatDepe);
    }, error => {
    })
  }


  getDependenciesByCod() {
    this.proRequirementeForm.controls.infoBasicaForm.controls.dependenciaDes.valueChanges.pipe(
      // debounceTime(1000), // Espera 1 segundo antes de emitir el valor del input
      distinctUntilChanged()  // Evita que se emita el valor si es igual al ultimo valor que se emitió
    ).subscribe(val => {
      if (val == null) { } else
        if (val != '') {
          this.serviceProRequirement.getDependenceElastic(val || '').subscribe((dataDependencie) => {
            this.listDependencies = dataDependencie.data;
          })
        }
    }) || '';
  }

  getSelectionModeByCod() {
    this.serviceProRequirement.getAllSelectionMode().subscribe((dataSelcMode) => {
      this.allSelectionMode = dataSelcMode.data;
    })
    // this.proRequirementeForm.controls.infoBasicaForm.controls.modalidadSel.valueChanges.pipe(
    //   distinctUntilChanged()
    // ).subscribe(val => {
    //   this.serviceProRequirement.getSelectionModeElastic(val || '').subscribe((dataSelcMode) => {
    //     this.listSelcMode = dataSelcMode.data;
    //   })
    // }) || '';

  }

  getAllContractualAction() {
    this.serviceProRequirement.getAllContractualAction().subscribe((dataAction) => {
      this.allContractualAction = dataAction.data;
    })
  }
  getAllContacType() {
    this.serviceProRequirement.getAllContacType().subscribe((dataContratType) => {
      this.listContacType = dataContratType.data;
    })
  }
  getAllProfile() {
    this.serviceProRequirement.getAllProfile().subscribe((dataProfile) => {
      this.allProfile = dataProfile.data
    })
  }
  getAuxiliarByCod() {
    this.serviceProRequirement.getAuxiliarByProject(+this.dataProjectID).subscribe((dataAuxuliar) => {
      this.listAuxiliar = dataAuxuliar.data

    })
  }
  getFuentesBycod() {
    this.serviceProRequirement.getFuentesByProject(+this.dataProjectID).subscribe((dataFuentes) => {
      this.listFuentes = dataFuentes.data
    }), (err: any) => {
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        ftnMSPS: ''
      })
    }
  }
  getAllActivities(auxId: number) {
    this.serviceProRequirement.getAllActivities(+this.dataProjectID, auxId).subscribe((dataActi) => {
      this.listActivities = dataActi.data

    })
  }
  getMGAByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.mga.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getMGAElastic(val).subscribe(dataMGA => {
        this.listMGA = dataMGA.data
      })
    })
  }
  getPOSPREByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.pospre.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getPOSPREElastic(val).subscribe(dataPOSPRE => {
        this.listPOSPRE = dataPOSPRE.data
      })
    })
  }
  getUNSPSCByCod() {
    this.proRequirementeForm.controls.codigosForm.controls.codCategoria.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getUNSPSCElastic(val).subscribe(dataUNSPSC => {
        this.listUNSPSC = dataUNSPSC.data
      })
    })
  }
  getAllReviewsArea() {
    this.serviceProRequirement.getAllReviewsArea(+this.dataProjectID).subscribe(dataReviews => {
      this.allReviewsArea = dataReviews.data
    })

  }
  getAllConcepts() {
    this.serviceProRequirement.getAllConcepts().subscribe(dataConcept => {
      this.allConcepts = dataConcept.data
    })
  }
  verifyNumReq() {
    if (this.typePage == 'Nuevo') {
      this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].valueChanges.pipe(
        distinctUntilChanged()
      ).subscribe(val => {
        this.genericNumReq = false
        if (val != '') {
          this.serviceProRequirement.verifyNumReq(+this.dataProjectID, val).subscribe(data => {
            this.errorNumReq = false
            if (data.data == false) {
              this.errorVerifyNumReq = true
              this.msjVerifyNumReq = data.title
            } else {
              this.errorVerifyNumReq = false
              this.msjVerifyNumReq = ''
            }
          })
        }

      })
    }

  }
  valuePerfil() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.idPerfil = val;
    })
  }
  verifyRangeSararial() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.genericValorHonMes = false
      if (val == null) { } else
        if (val != 0) {
          //obtener ano actual
          let anio: number = this.proRequirementeForm.controls.infoBasicaForm.controls.anioContrato.value;
          let anioActual = null;
          if(!anio) {
            anioActual = new Date().getFullYear()
          } else {
            anioActual = anio;
          }
          // console.log('anioActual1', anioActual)
          this.serviceProRequirement.verifyRangeSararial(this.idPerfil, val, anioActual).subscribe(data => {
            if (data.data == false) {
              this.errorRangeSararial = true;
              this.msjVerifyRangeSararial = data.message
            } else {
              this.errorRangeSararial = false;
              this.msjVerifyRangeSararial = data.message
            }
          })
        }

    })
  }
  getDataConsulta(projectId: number, requestId: number, reqTempId: number) {
    this.isDataTemporal = true
    this.serviceProRequirement.getAllDataTemporalModified(projectId, requestId, reqTempId).subscribe(dataTemp => {
      this.dataRequirementNum = dataTemp.requerimiento.numeroRequerimiento.toString();
      this.reqID = dataTemp.requerimiento.requerimiento_ID
      let dataReviews = dataTemp
      if (dataReviews != null) {
        if (dataReviews.requerimiento.numeroDeContrato != '' && dataReviews.requerimiento.numeroDeContrato != '0') {
          this.serviceProRequirement.getAniosBycontrato(+dataReviews.requerimiento.numeroDeContrato).subscribe(res => {
            this.years = res.data
          })
        }


        this.versionReviewForm.setValue({
          codigoProRew: dataReviews.proyecto.codigoProyecto,
          dependenciaOriRew: dataReviews.proyecto.dependenciaOrigen.codigo.concat(' ', dataReviews.proyecto.dependenciaOrigen.detalle),
          numeroReqRew: dataReviews.requerimiento.numeroRequerimiento.toString(),
          dependenciaDesRew: dataReviews.requerimiento.dependenciaDestino,
          mesSeleccionRew: dataReviews.requerimiento.mesEstimadoInicioSeleccion.toString(),
          mesOfertasRew: dataReviews.requerimiento.mesEstimadoPresentacion.toString(),
          mesContratoRew: dataReviews.requerimiento.mesEstmadoInicioEjecucion.toString(),
          duracionMesRew: dataReviews.requerimiento.duracionMes,
          duracionDiasRew: dataReviews.requerimiento.duracionDias,
          modalidadSelRew: dataReviews.requerimiento.modalidadSeleccion.modalidad_Sel_ID,
          actuacionContRew: dataReviews.requerimiento.actuacion.actuacion_ID,
          numeroContRew: dataReviews.requerimiento.numeroDeContrato,
          anioContratoRew: dataReviews.requerimiento.anioContrato,
          tipoContRew: dataReviews.requerimiento.tipoContrato.tipoContrato_ID,
          perfilRew: dataReviews.requerimiento.perfil.perfil_ID,
          valorHonMesRew: dataReviews.requerimiento.honorarios.toString(),
          cantidadContRew: dataReviews.requerimiento.cantidadDeContratos,
          descripcionRew: dataReviews.requerimiento.descripcion,

        })
        this.initialAppYaers = dataReviews.aniosVigencia

        this.numeroRequerimientoModified = dataReviews.requerimiento.numeroRequerimientoModified
        this.dependenciaDestinoModified = dataReviews.requerimiento.dependenciaDestinoModified
        this.mesEstimadoInicioSeleccionModified = dataReviews.requerimiento.mesEstimadoInicioSeleccionModified
        this.mesEstimadoPresentacionModified = dataReviews.requerimiento.mesEstimadoPresentacionModified
        this.mesEstmadoInicioEjecucionModified = dataReviews.requerimiento.mesEstmadoInicioEjecucionModified
        this.duracionMesModified = dataReviews.requerimiento.duracionMesModified
        this.duracionDiasModified = dataReviews.requerimiento.duracionDiasModified
        this.modalidadSeleccionModified = dataReviews.requerimiento.modalidadSeleccionModified
        this.actuacionModified = dataReviews.requerimiento.actuacionModified
        this.numeroDeContratoModified = dataReviews.requerimiento.numeroDeContratoModified
        this.anioContratoModified = dataReviews.requerimiento.anioContratoModified
        this.tipoContratoModified = dataReviews.requerimiento.tipoContratoModified
        this.perfilModified = dataReviews.requerimiento.perfilModified
        this.honorariosModified = dataReviews.requerimiento.honorariosModified
        this.cantidadDeContratosModified = dataReviews.requerimiento.cantidadDeContratosModified
        this.descripcionModified = dataReviews.requerimiento.descripcionModified

        // const dependenciaDestinoModified = dataReviews.requerimiento.dependenciaDestinoModified
        this.cadenasPresupuestalesVerRew = dataReviews.cadenasPresupuestales
        this.dataSourceClasificacionesRew = new MatTableDataSource(this.cadenasPresupuestalesVerRew)

        this.codigosVerRew = dataReviews.codsUNSPSC
        this.dataSourceCodigosRew = new MatTableDataSource(this.codigosVerRew);



        this.servicesinitialApp.getAllInitialApropriationTemp(reqTempId, dataReviews.aniosVigencia[0], requestId).subscribe(data => {

          const ValAppIni = String(data.data.valorApropiacion_Incial)
          const VAL_APP_INI = this.assignCurrencyPipe(ValAppIni)
          const ValAppAnio = String(data.data.valorApropiacionAnio)
          const VAL_APP_ANIO = this.assignCurrencyPipe(ValAppAnio)
          const ValAppFin = String(data.data.valorApropiacion_Final)
          const VAL_APP_FIN = this.assignCurrencyPipe(ValAppFin)

          this.initialAppro.setValue({
            valorApropiacion_Incial: VAL_APP_INI,
            anio_Vigencia: data.data.anio_Vigencia,
            valorApropiacionAnio: VAL_APP_ANIO,
            valorApropiacion_Final: VAL_APP_FIN,
          })
          this.currencyInputAppro();

        })
      } else {
        // this.openSnackBar('Error', dataReviews.Message, 'error')
        // this.viewVersion = false
      }

    }, error => {

    })
  }
  getAllDataTemporal(projectId: number, requestId: number, reqTempId: number) {
    this.isDataTemporal = true
    this.serviceProRequirement.getAllDataTemporal(projectId, requestId, reqTempId).subscribe(dataTemp => {
      this.dataRequirementNum = dataTemp.requerimiento.numeroRequerimiento.toString();

      this.reqID = dataTemp.requerimiento.requerimiento_ID
      this.proRequirementeForm.controls.clasPresFinaForm.controls.numModificacion.setValue(dataTemp.requerimiento.numeroModificacion)
      if (dataTemp != null) {
        this.proRequirementeForm.controls.infoBasicaForm.setValue({
          numeroReq: dataTemp.requerimiento.numeroRequerimiento,
          dependenciaDes: dataTemp.requerimiento.dependenciaDestino,
          mesSeleccion: dataTemp.requerimiento.mesEstimadoInicioSeleccion.toString(),
          mesOfertas: dataTemp.requerimiento.mesEstimadoPresentacion.toString(),
          mesContrato: dataTemp.requerimiento.mesEstmadoInicioEjecucion.toString(),
          duracionMes: dataTemp.requerimiento.duracionMes,
          duracionDias: dataTemp.requerimiento.duracionDias,
          modalidadSel: dataTemp.requerimiento.modalidadSeleccion.modalidad_Sel_ID,
          actuacionCont: dataTemp.requerimiento.actuacion.actuacion_ID,
          numeroCont: dataTemp.requerimiento.numeroDeContrato || '',
          anioContrato: dataTemp.requerimiento.anioContrato,
          tipoCont: dataTemp.requerimiento.tipoContrato.tipoContrato_ID,
          perfil: dataTemp.requerimiento.perfil.perfil_ID,
          valorHonMes: dataTemp.requerimiento.honorarios.toString() || '',
          cantidadCont: dataTemp.requerimiento.cantidadDeContratos || '',
          descripcion: dataTemp.requerimiento.descripcion,
          codigoPro: dataTemp.proyecto.codigoProyecto,
          dependenciaOri: dataTemp.proyecto.dependenciaOrigen.codigo.concat(' ', dataTemp.proyecto.dependenciaOrigen.detalle),
        })
        this.initialAppYaers = dataTemp.aniosVigencia
        this.proRequirementeForm.controls.infoBasicaForm.controls.numeroReq.disable()
        this.numContratoTmp = dataTemp.requerimiento.numeroDeContrato;
        this.anioContratoTmp = dataTemp.requerimiento.anioContrato;
        this.tipoContratoTmp = dataTemp.requerimiento.tipoContrato.tipoContrato_ID;
        this.perfilTmp = dataTemp.requerimiento.perfil.perfil_ID;
        this.honorariosTmp = dataTemp.requerimiento.honorarios;
        this.onSelectionChange(dataTemp.requerimiento.actuacion.actuacion_ID, 'actContractual')
        this.errorNumReq = false
        this.errorVerifyNumReq = false
        this.errorDependencia = false
        this.errorMesSeleccion = false
        this.errorMesOferta = false
        this.errorMesContrato = false
        this.errorDuratioMes = false
        this.errorMesSeleccion = false

        this.formEditRequirement = true
        this.dependencieId = dataTemp.requerimiento.dependenciaDestino.dependencia_ID.toString()
        this.selcModeId = dataTemp.requerimiento.modalidadSeleccion.modalidad_Sel_ID.toString()

        this.dataTableClasificaciones = dataTemp.cadenasPresupuestales
        this.cadenasPresupuestalesTemporal = dataTemp.cadenasPresupuestales
        var stringToStoreCla = JSON.stringify(this.cadenasPresupuestalesTemporal);
        ProChartStorage.setItem("dataTableClacificaciones", stringToStoreCla);
        var fromStorageCla = ProChartStorage.getItem("dataTableClacificaciones");
        this.reloadDataTbl(fromStorageCla, 'clasificaciones');
        this.dataTableCodigos = dataTemp.codsUNSPSC
        this.codigosTemporal = dataTemp.codsUNSPSC
        var stringToStoreCod = JSON.stringify(this.codigosTemporal);
        ProChartStorage.setItem("dataTableCodigos", stringToStoreCod);
        var fromStorageCod = ProChartStorage.getItem("dataTableCodigos");
        this.reloadDataTbl(fromStorageCod, 'codigos');

        this.servicesinitialApp.getAllInitialApropriationTemp(+this.dataRequirementID, dataTemp.aniosVigencia[0], +this.dataSolicitudID).subscribe(data => {
          const ValAppIni = String(data.data.valorApropiacion_Incial)
          const VAL_APP_INI = this.assignCurrencyPipe(ValAppIni)
          const ValAppAnio = String(data.data.valorApropiacionAnio)
          const VAL_APP_ANIO = this.assignCurrencyPipe(ValAppAnio)
          const ValAppFin = String(data.data.valorApropiacion_Final)
          const VAL_APP_FIN = this.assignCurrencyPipe(ValAppFin)

          this.initialAppro.setValue({
            valorApropiacion_Incial: VAL_APP_INI,
            anio_Vigencia: data.data.anio_Vigencia,
            valorApropiacionAnio: VAL_APP_ANIO,
            valorApropiacion_Final: VAL_APP_FIN,
          })
          this.currencyInputAppro();
        })

        // this.initialAppro.setValue({
        //   apropIni_ID: dataTemp.apropiacionInicial.apropIni_ID,
        //   vigencia0: dataTemp.apropiacionInicial.anioV0,
        //   valor0: dataTemp.apropiacionInicial.valor0,
        //   vigencia1: dataTemp.apropiacionInicial.anioV1,
        //   valor1: dataTemp.apropiacionInicial.valor1,
        //   vigencia2: dataTemp.apropiacionInicial.anioV2,
        //   valor2: dataTemp.apropiacionInicial.valor2,
        //   valorTotal: dataTemp.apropiacionInicial.valorTotal
        // })
      } else {

      }
    })
  }

  getDataAprobad(projectId: number, requerimetId: number) {
    this.serviceProRequirement.getDataAprobad(projectId, requerimetId).subscribe(dataAprobad => {
      let dataApro = dataAprobad.data
      if (dataAprobad.data != null) {
        this.dataRequirementNum = dataApro.requerimiento.numeroRequerimiento.toString();
        if (dataApro.requerimiento.numeroDeContrato != "") {
          this.serviceProRequirement.getAniosBycontrato(+dataApro.requerimiento.numeroDeContrato).subscribe(res => {
            this.years = res.data
          })
        }
        this.versionActualForm.setValue({
          codigoProAct: dataApro.proyecto.codigoProyecto,
          dependenciaOriAct: dataApro.proyecto.dependenciaOrigen.codigo.concat(' ', dataApro.proyecto.dependenciaOrigen.detalle),
          numeroReqAct: dataApro.requerimiento.numeroRequerimiento.toString(),
          dependenciaDesAct: dataApro.requerimiento.dependenciaDestino,
          mesSeleccionAct: dataApro.requerimiento.mesEstimadoInicioSeleccion.toString(),
          mesOfertasAct: dataApro.requerimiento.mesEstimadoPresentacion.toString(),
          mesContratoAct: dataApro.requerimiento.mesEstmadoInicioEjecucion.toString(),
          duracionMesAct: dataApro.requerimiento.duracionMes,
          duracionDiasAct: dataApro.requerimiento.duracionDias,
          modalidadSelAct: dataApro.requerimiento.modalidadSeleccion.modalidad_Sel_ID,
          actuacionContAct: dataApro.requerimiento.actuacion.actuacion_ID,
          numeroContAct: dataApro.requerimiento.numeroDeContrato,
          anioContratoAct: dataApro.requerimiento.anioContrato,
          tipoContAct: dataApro.requerimiento.tipoContrato.tipoContrato_ID,
          perfilAct: dataApro.requerimiento.perfil.perfil_ID,
          valorHonMesAct: dataApro.requerimiento.honorarios.toString(),
          cantidadContAct: dataApro.requerimiento.cantidadDeContratos,
          descripcionAct: dataApro.requerimiento.descripcion,


        })
        this.initialAppYaers = dataApro.aniosVigencia
        this.cadenasPresupuestalesVerAct = dataApro.cadenasPresupuestales
        this.dataSourceClasificacionesAct = new MatTableDataSource(this.cadenasPresupuestalesVerAct)

        this.codigosVerAct = dataApro.codsUNSPSC
        this.dataSourceCodigosAct = new MatTableDataSource(this.codigosVerAct);
        this.servicesinitialApp.getAllInitialApropriation(requerimetId, dataApro.aniosVigencia[0]).subscribe(data => {
          if (data.status == 200) {
            const ValAppIni = String(data.data.valorApropiacion_Incial)
            const VAL_APP_INI = this.assignCurrencyPipe(ValAppIni)
            const ValAppAnio = String(data.data.valorApropiacionAnio)
            const VAL_APP_ANIO = this.assignCurrencyPipe(ValAppAnio)
            const ValAppFin = String(data.data.valorApropiacion_Final)
            const VAL_APP_FIN = this.assignCurrencyPipe(ValAppFin)

            this.initialAppro.setValue({
              valorApropiacion_Incial: VAL_APP_INI,
              anio_Vigencia: data.data.anio_Vigencia,
              valorApropiacionAnio: VAL_APP_ANIO,
              valorApropiacion_Final: VAL_APP_FIN,
            })
            this.currencyInputAppro();
          } else if (data.status == 404) {
            let Data: string[] = [];
            Data = Object.values(data.data);
            let errorMessages = '';
            Data.map(item => {
              errorMessages += item + '. ';
            });
            this.errInitialAppYaers = true
            this.msjInitialAppYaers = errorMessages
            // this.openSnackBar('Error', data.message, 'error')
          }
        })
      } else if (dataAprobad.data == null) {
        this.openSnackBar('Error', dataAprobad.message, 'error')
        this.viewVersion = false
      }

    })
  }
  cancel() {
    if (this.typePage == 'Nuevo') {
      //Alerta de confirmación
      Swal.fire({
        customClass: {
          confirmButton: 'swalBtnColor',
          denyButton: 'swalBtnColor'
        },
        title: '¿Esta seguro que desea cancelar?',
        text: ' Esta acción eliminará los ultimos cambios realizados',
        showDenyButton: true,
        denyButtonText: 'NO',
        confirmButtonText: 'SI',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + this.dataSolicitudID])
        }
      });
    } else
      if (this.typePage == 'Editar' && this.statusReq == 'En Creación') {
        //Alerta de confirmación
        Swal.fire({
          customClass: {
            confirmButton: 'swalBtnColor',
            denyButton: 'swalBtnColor'
          },
          title: '¿Esta seguro que desea cancelar?',
          text: ' Esta acción eliminará los ultimos cambios realizados',
          showDenyButton: true,
          denyButtonText: 'NO',
          confirmButtonText: 'SI',
          allowOutsideClick: false
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + this.dataSolicitudID])
          }
        });
      } else
        if (this.typePage == 'Ajuste' && this.statusReq == 'En Ajuste') {
          //Alerta de confirmación
          Swal.fire({
            customClass: {
              confirmButton: 'swalBtnColor',
              denyButton: 'swalBtnColor'
            },
            title: '¿Esta seguro que desea cancelar?',
            text: ' Esta acción eliminará los ultimos cambios realizados',
            showDenyButton: true,
            denyButtonText: 'NO',
            confirmButtonText: 'SI',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {

              if (sessionStorage.getItem('mga') == 'taskTray') {
                this.router.navigate(['/WAPI/PAA/BandejaDeTareas']);
              } else {
                this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + this.dataSolicitudID])
              }
            }
          });
        } else if (this.typePage == 'Editar' && this.statusReq == 'En Ajuste') {
          //Alerta de confirmación
          Swal.fire({
            customClass: {
              confirmButton: 'swalBtnColor',
              denyButton: 'swalBtnColor'
            },
            title: '¿Esta seguro que desea cancelar?',
            text: ' Esta acción eliminará los ultimos cambios realizados',
            showDenyButton: true,
            denyButtonText: 'NO',
            confirmButtonText: 'SI',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {

              this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + this.dataSolicitudID])

            }
          });
        } else if (this.typePage == 'Nuevo') {
          this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + this.dataSolicitudID])
        } else if (this.typePage == 'Editar') {
          this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + this.dataSolicitudID])
        } else if (this.typePage == 'Revision') {
          this.router.navigate(['/WAPI/PAA/BandejaDeTareas/'])
        } else if (this.typePage == 'Vista') {
          this.router.navigate(['/WAPI/PAA/Requerimientos/' + this.dataProjectID])
        }
  }

  saveForm() {
    if (this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].value == null || this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].value == '') {
      this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].setValue(0)
    } else if (this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].value == null || this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].value == '') {
      this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].setValue(0)
    }
    /** traer todos los ID del arreglo dataTableCodigos */
    let idsCodigos = this.dataTableCodigos.map((item) => {
      return item.unspsC_ID = item.unspsC_ID
    })
    if (this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].value == null) {
      this.errorNumReq = true;
      this.openSnackBar('Error', 'Numero de requerimiento es obligatorio', 'error');

    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].value == null) {
      this.errorDependencia = true;
      this.openSnackBar('Error', 'Dependencia es obligatorio', 'error');
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['mesSeleccion'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['mesSeleccion'].value == null) {
      this.errorMesSeleccion = true;
      this.openSnackBar('Error', 'Mes de selección es obligatorio', 'error');
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['mesOfertas'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['mesOfertas'].value == null) {
      this.errorMesOferta = true;
      this.openSnackBar('Error', 'Mes de ofertas es obligatorio', 'error');
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['mesContrato'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['mesContrato'].value == null) {
      this.errorMesContrato = true;
      this.openSnackBar('Error', 'Mes de contrato es obligatorio', 'error');
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].value == null) {
      this.errorDuratioMes = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].value == null) {
      this.errorDurationDia = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['modalidadSel'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['modalidadSel'].value == null) {
      this.errorModalidad = true;
      this.openSnackBar('Error', 'Modalidad de selección es obligatorio', 'error');
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['actuacionCont'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['actuacionCont'].value == null) {
      this.errorActuacion = true;
      this.openSnackBar('Error', 'Actuación contractual es obligatorio', 'error');
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['cantidadCont'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['cantidadCont'].value == null) {
      // this.proRequirementeForm.controls.infoBasicaForm.controls['cantidadCont'].setValue(0)
      this.errorCantContrato = true;
      this.openSnackBar('Error', 'Cantidad de contrato es obligatorio', 'error');
      return;

    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['descripcion'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['descripcion'].value == null) {
      this.errorDescripcionCont = true;
    } else {
      this.formVerifyComplete['infoBasica'] = this.proRequirementeForm.controls.infoBasicaForm.value

      let dtaCla = ProChartStorage.getItem('dataTableClacificaciones')
      this.dataClasificacion = JSON.parse(dtaCla || '[]')
      this.formVerifyComplete['clasificaciones'] = JSON.parse(dtaCla || '[]')
      let dtaCod = ProChartStorage.getItem('dataTableCodigos')
      this.dataCodigos = JSON.parse(dtaCod || '[]')
      this.formVerifyComplete['codigos'] = JSON.parse(dtaCod || '[]')

      this.dataClasificacion.forEach((item: any) => {
        item.anioVigRecursos = item.anioVigRecursos
        item.proj_ID = +this.dataProjectID
        item.mgA_ID = item.mga.mgA_ID
        item.pospre_ID = item.pospre.pospre_ID
        item.actividad_ID = item.actividad.actividad_ID
        item.auxiliar_ID = item.auxiliar == null ? null : item.auxiliar.auxiliar_ID
        item.fuente_ID = item.fuente.fuente_ID
        delete item.mga
        delete item.pospre
        delete item.actividad
        delete item.auxiliar
        delete item.fuente
        delete item.uuid
      })
      this.dataCodigos.forEach((item: any) => {
        item.unspsC_ID = item.unspsC_ID || item.unspsc.unspsC_ID
        delete item.unspsc
        delete item.descripcion
        delete item.codigoUNSPSC
      })

      let requerimientoForm = {} as requerimientoI
      if (this.typePage == 'nuevo') {
        requerimientoForm.req_ID = 0
      } else {
        requerimientoForm.req_ID = this.reqID
      }

      requerimientoForm.numeroRequerimiento = this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].value
      requerimientoForm.numeroModificacion = +this.dataRequirementNum
      requerimientoForm.dependenciaDestino_Id = +this.dependencieId
      requerimientoForm.mesEstimadoInicioSeleccion = this.proRequirementeForm.controls.infoBasicaForm.value.mesSeleccion
      requerimientoForm.mesEstimadoPresentacion = this.proRequirementeForm.controls.infoBasicaForm.value.mesOfertas
      requerimientoForm.mesEstmadoInicioEjecucion = this.proRequirementeForm.controls.infoBasicaForm.value.mesContrato
      requerimientoForm.duracionMes = this.proRequirementeForm.controls.infoBasicaForm.value.duracionMes
      requerimientoForm.duracionDias = this.proRequirementeForm.controls.infoBasicaForm.value.duracionDias
      requerimientoForm.modalidadSeleccion_Id = this.proRequirementeForm.controls.infoBasicaForm.value.modalidadSel

      requerimientoForm.actuacion_Id = this.proRequirementeForm.controls.infoBasicaForm.value.actuacionCont
      if (requerimientoForm.actuacion_Id == 2) {
        requerimientoForm.numeroDeContrato = this.numContratoTmp
        requerimientoForm.tipoContrato_Id = this.proRequirementeForm.controls.infoBasicaForm.value.tipoCont
        requerimientoForm.perfil_Id = this.proRequirementeForm.controls.infoBasicaForm.value.perfil
        requerimientoForm.honorarios = +this.proRequirementeForm.controls.infoBasicaForm.value.valorHonMes
      } else if (requerimientoForm.actuacion_Id == 3) {
        requerimientoForm.numeroDeContrato = this.proRequirementeForm.controls.infoBasicaForm.value.numeroCont
        requerimientoForm.anioContrato = this.proRequirementeForm.controls.infoBasicaForm.value.anioContrato
        requerimientoForm.tipoContrato_Id = this.tipoContratoTmp
        requerimientoForm.perfil_Id = this.perfilTmp
        requerimientoForm.honorarios = this.honorariosTmp
      }
      requerimientoForm.cantidadDeContratos = this.proRequirementeForm.controls.infoBasicaForm.value.cantidadCont
      requerimientoForm.descripcion = this.proRequirementeForm.controls.infoBasicaForm.value.descripcion
      requerimientoForm.version = 0
      this.formVerify.requerimiento = requerimientoForm
      this.formVerify.proj_ID = +this.dataProjectID

      this.formVerify.cadenasPresupuestales = this.dataClasificacion
      this.formVerify.codsUNSPSC = this.dataCodigos

      if (this.typePage == 'Nuevo') {
        this.serviceProRequirement.postVerifyDataSaveI(this.formVerify).subscribe(dataResponse => {
          if (dataResponse.status == 200) {
            var stringToStoreCom = JSON.stringify(this.formVerifyComplete);
            ProChartStorage.setItem("formVerifyComplete", stringToStoreCom);
            var stringToStore = JSON.stringify(this.formVerify);
            ProChartStorage.setItem("formVerify", stringToStore);

            ProChartStorage.removeItem('dataTableClacificaciones')
            ProChartStorage.removeItem('dataTableCodigos')
            ProChartStorage.removeItem('dataTableRevisiones')
            this.openSnackBar('Se ha creado correctamente', dataResponse.message, 'success');
            if (sessionStorage.getItem('mga') == 'taskTray') {
              this.router.navigate(['/WAPI/PAA/BandejaDeTareas']);
            } else {
              this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + +this.dataSolicitudID])

            }
          } else {


            this.openSnackBar('Error', dataResponse.message, 'error');
          }
        }, err => {

          let dataError = err.error.data

          //valodacion de errores genericos
          if (dataError['Requerimiento.Numero de requerimiento'] != undefined) {
            this.genericNumReq = true
          }
          if (dataError['Requerimiento.Dependencia destino'] != undefined) {
            this.genericDependenciaDes = true
          }
          if (dataError['Requerimiento.Modalidad de seleccion'] != undefined) {
            this.genericModalidadSel = true
          }
          if (dataError['Requerimiento.Tipo de Contrato'] != undefined) {
            this.genericTipoCont = true
          }
          if (dataError['Requerimiento.Perfil'] != undefined) {
            this.genericPerfil = true
          }
          if (dataError['Requerimiento.Honorarios'] != undefined) {
            this.genericValorHonMes = true
          }
          if (dataError['Requerimiento.Actuacion'] != undefined) {
            this.genericActuacionCont = true
          }
          if (dataError['Requerimiento.Duracion Mes'] != undefined) {
            this.genericDuracionMes = true
          }
          if (dataError['Requerimiento.Duracion dias'] != undefined) {
            this.genericDuracionDias = true
          }
          if (dataError['Requerimiento.Mes estimado inicio de seleccion'] != undefined) {
            this.genericMesSeleccion = true
          }
          if (dataError['Requerimiento.Mes estimado presentacion de ofertas'] != undefined) {
            this.genericMesOfertas = true
          }
          if (dataError['Requerimiento.Mes estimado inicio de Ejecucion'] != undefined) {
            this.genericMesContrato = true
          }
          if (dataError['Requerimiento.Cantidad de contratos'] != undefined) {
            this.genericCantidadCont = true
          }
          if (dataError['Requerimiento.Descripción'] != undefined) {
            this.genericDescripcion = true
          }
          if (dataError['Requerimiento.Numero de contrato'] != undefined) {
            this.genericNumeroCont = true
          }
          if (dataError['Cadenas presupuestales'] != undefined) {
            this.genericClasificaciones = true
          }
          if (dataError['Codigos UNSPSC'] != undefined) {
            this.genericCodigos = true
          }

          let Data: string[] = [];
          Data = Object.values(err.error.data);
          let errorMessages = '';
          Data.map(item => {
            errorMessages += item + '. ';
          });
          this.openSnackBar('Error', err.error.message, 'error', errorMessages);
        })
      } else {
        this.formModificationRequest.idProyecto = +this.dataProjectID
        this.formModificationRequest.observacion = 'editRequeriment'
        let saveDataEditDatos = {} as saveDataEditDatosI
        saveDataEditDatos.modificacion_ID = +this.dataRequirementID

        if (this.reqID == 0) {
          saveDataEditDatos.accion = 1
        } else {
          saveDataEditDatos.accion = 2
        }
        saveDataEditDatos.modificacion = this.formVerify
        let saveDataDatos: saveDataEditDatosI[] = [saveDataEditDatos]
        this.formModificationRequest.datos = saveDataDatos
        this.formModificationRequest.contrapartidas = []
        this.formModificationRequest.solicitudModID = +this.dataSolicitudID
        this.formModificationRequest.deleteReqIDs = []
        this.formModificationRequest.deleteContraIDs = []
        this.serviceProRequirement.putModificationRequestSend(this.formModificationRequest).subscribe(dataResponse => {

          if (dataResponse.status == 200) {

            this.loading = true
            this.openSnackBar('Se ha guardado correctamente', dataResponse.message, 'success');
            if (sessionStorage.getItem('mga') == 'taskTray') {
              this.router.navigate(['/WAPI/PAA/BandejaDeTareas']);
            } else {
              this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + +this.dataSolicitudID])

            }
            this.loading = false

          } else if (dataResponse.status == 423) {
            this.openSnackBar('Lo sentimos', dataResponse.message, 'error', `Generando archivo de errores "${dataResponse.data.FileName}".`);
            this.convertBase64ToFileDownload(dataResponse.data.FileAsBase64, dataResponse.data.FileName);
          } else {

            let Data: string[] = [];
            Data = Object.values(dataResponse.data);
            let erorsMessages = '';
            Data.map(item => {
              erorsMessages += item + '. ';
            });
            this.openSnackBar('Error', dataResponse.message && JSON.stringify(dataResponse.data), 'error');
          }
        }, err => {
          //valodacion de errores genericos
          let dataError = err.error.data
          if (dataError['Requerimiento.Numero de requerimiento'] != undefined) {
            this.genericNumReq = true
          }
          if (dataError['Requerimiento.Dependencia destino'] != undefined) {
            this.genericDependenciaDes = true
          }
          if (dataError['Requerimiento.Modalidad de seleccion'] != undefined) {
            this.genericModalidadSel = true
          }
          if (dataError['Requerimiento.Tipo de Contrato'] != undefined) {
            this.genericTipoCont = true
          }
          if (dataError['Requerimiento.Perfil'] != undefined) {
            this.genericPerfil = true
          }
          if (dataError['Requerimiento.Honorarios'] != undefined) {
            this.genericValorHonMes = true
          }
          if (dataError['Requerimiento.Actuacion'] != undefined) {
            this.genericActuacionCont = true
          }
          if (dataError['Requerimiento.Duracion Mes'] != undefined) {
            this.genericDuracionMes = true
          }
          if (dataError['Requerimiento.Duracion dias'] != undefined) {
            this.genericDuracionDias = true
          }
          if (dataError['Requerimiento.Mes estimado inicio de seleccion'] != undefined) {
            this.genericMesSeleccion = true
          }
          if (dataError['Requerimiento.Mes estimado presentacion de ofertas'] != undefined) {
            this.genericMesOfertas = true
          }
          if (dataError['Requerimiento.Mes estimado inicio de Ejecucion'] != undefined) {
            this.genericMesContrato = true
          }
          if (dataError['Requerimiento.Cantidad de contratos'] != undefined) {
            this.genericCantidadCont = true
          }
          if (dataError['Requerimiento.Descripción'] != undefined) {
            this.genericDescripcion = true
          }
          if (dataError['Requerimiento.Numero de contrato'] != undefined) {
            this.genericNumeroCont = true
          }
          if (dataError['Cadenas presupuestales'] != undefined) {
            this.genericClasificaciones = true
          }
          if (dataError['Codigos UNSPSC'] != undefined) {
            this.genericCodigos = true
          }

          let Data: string[] = [];
          Data = Object.values(err.error.data);
          let errorMessages = '';
          Data.map(item => {
            errorMessages += item + '. ';
          });
          this.openSnackBar('Error', err.error.message, 'error', errorMessages);

        })

      }

    }
  }

  //funciones para retornar el valor al autocomplete
  displayFn(value: any) {
    if (value == null) {
      return value ? value.codigo.concat(' ', value.detalle) : value
    } else if (value != null) {
      if (value.detalle == null || value.detalle == undefined || value.detalle == '') {
        return value.codigo
      }
      return value ? value.codigo.concat(' ', value.detalle) : value && value.codigo ? value.codigo.concat(' ', value.descripcion) : ''
    } else
      return value.codigo ? value.codigo.concat(' ', value.descripcion) : ''
  }
  displayFnAux(value: any) {
    return value ? value.codigoAuxiliar : ''
  }
  displayFnFte(value: any) {
    return value.codigoFuente ? value.codigoFuente.concat('  ', value.descripcion) : ''
  }
  displayFnAct(value: any) {
    return value ? value.codigoAct : ''
  }
  displayFnMGA(value: any) {
    return value ? value.codigoMGA : ''
  }
  displayFnPOSPRE(value: any) {
    return value ? value.codigo : ''
  }
  displayFnCod(value: any) {
    return value ? value.codigoUNSPSC : ''
  }
  displayFnArea(value: any) {
    return value ? value.nombre : ''
  }
  //funcion para obtener el id del autocomplete
  onSelectionChange(event: any, tipo: string) {
    if (tipo == 'actContractual') {
      if (event == 3) {
        //diable campos formulario
        this.disabledAdicion = true
        this.disabledInicial = false
        this.proRequirementeForm.controls.infoBasicaForm.controls['numeroCont'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['anioContrato'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['tipoCont'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].disable();
        if (this.typePage == 'Nuevo') {
          this.proRequirementeForm.controls.infoBasicaForm.controls['tipoCont'].setValue('');
          this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].setValue('');
          this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].setValue('');
        }

      } else if (event == 2) {
        this.disabledAdicion = false
        this.disabledInicial = true
        this.proRequirementeForm.controls.infoBasicaForm.controls['numeroCont'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['anioContrato'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['tipoCont'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].enable();
        if (this.typePage == 'Nuevo' || this.typePage == 'Editar') {
          this.proRequirementeForm.controls.infoBasicaForm.controls['numeroCont'].setValue('');
          this.proRequirementeForm.controls.infoBasicaForm.controls['anioContrato'].setValue('');
        }

      }
    }
    if (tipo == 'mesClas') {
      this.errorMes = false;
    } event
    if (tipo == 'vigeRecursos') {
      this.errorVigRec = false;
    }
    if (tipo === 'dependenciaDes') {
      this.dependencieId = event.option.value.dependencia_ID;
      this.depDesValue = event.option.value


      this.errorDependencia = false

    }
    if (tipo === 'modalidadSel') {
      this.selcModeId = event.option.value.modalidad_Sel_ID;
    }
    if (tipo == 'auxiliar') {
      this.errorAux = false;
      //reset campos del formulario actividad,meta,mga y pospre
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        actividad: null,
        meta: null,
        mga: null,
        pospre: null
      })

    }
    if (tipo == 'fuente') {
      this.fuenteId = event.fuente_ID
      this.errorFuentes = false;
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        ftnMSPS: event.fuenteMSPS
      })
    }
    if (tipo == 'actividad') {
      this.activityId = event.value.actividad_ID
      this.errorActi = false;
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        meta: event.value.metaODS
      })
      this.serviceProRequirement.getMGAById(event.value.mga_ID).subscribe(res => {
        this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
          mga: res.data.codigoMGA
        })
        this.mgaValue = res.data
      })
      this.serviceProRequirement.getPOSPREById(event.value.pospre_ID).subscribe(res => {
        this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
          pospre: res.data.codigo
        })
        this.pospreValue = res.data
      })

    }
    if (tipo == 'MGA') {
      this.MGAId = event.option.value.mgA_ID
      this.errorMGA = false;
    }
    if (tipo == 'POSPRE') {
      this.POSPREId = event.option.value.pospre_ID
      this.errorPOSPRE = false;
    }
    if (tipo == 'codCategoria') {
      this.UNSPSCId = event.option.value.unspsC_ID
      this.errorCodigos = false;
      this.proRequirementeForm.controls.codigosForm.patchValue({
        descCategoria: event.option.value.descripcion
      })
    }
    if (tipo == 'areaRevicion') {
      this.errorArea = false;
    }
    if (tipo == 'conceptoRevicion') {
      this.errorConcepto = false;
    }
    if (tipo == 'observacionRevicion') {
      this.errorObservaciones = false;
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


  }


  addDataTbl(type: string) {
    if (type == 'clasificaciones') {
      if (this.proRequirementeForm.controls.clasPresFinaForm.controls['mes'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['mes'].value == null) {
        this.errorMes = true;
      } else if (this.proRequirementeForm.controls.clasPresFinaForm.controls['anioVigRecursos'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['anioVigRecursos'].value == null) {
        this.errorVigRec = true;
      } else if (this.proRequirementeForm.controls.clasPresFinaForm.controls['auxiliar'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['auxiliar'].value == null) {
        this.errorAux = true;
      } else if (this.proRequirementeForm.controls.clasPresFinaForm.controls['fuente'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['fuente'].value == null) {
        this.errorFuentes = true;
      } else if (this.proRequirementeForm.controls.clasPresFinaForm.controls['actividad'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['actividad'].value == null) {
        this.errorActi = true;
      } else if (this.proRequirementeForm.controls.clasPresFinaForm.controls['mga'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['mga'].value == null) {
        this.errorMGA = true;
      } else if (this.proRequirementeForm.controls.clasPresFinaForm.controls['pospre'].value == '' || this.proRequirementeForm.controls.clasPresFinaForm.controls['pospre'].value == null) {
        this.errorPOSPRE = true;
      } else {
        this.dataTableClasificacion = this.proRequirementeForm.controls.clasPresFinaForm.value
        this.dataTableClasificacion['uuid'] = uuid();
        // this.dataTableClasificacion['mes'] = this.proRequirementeForm.controls.clasPresFinaForm.controls['mes'].value;
        // this.dataTableClasificacion['anioVigRecursos'] = this.proRequirementeForm.controls.clasPresFinaForm.controls['anioVigRecursos'].value;
        // this.dataTableClasificacion['auxiliar'] = this.proRequirementeForm.controls.clasPresFinaForm.controls['auxiliar'].value;
        // this.dataTableClasificacion['fuente'] = this.proRequirementeForm.controls.clasPresFinaForm.controls['fuente'].value;
        // this.dataTableClasificacion['actividad'] = this.proRequirementeForm.controls.clasPresFinaForm.controls['actividad'].value;
        // this.dataTableClasificacion['meta'] =  this.proRequirementeForm.controls.clasPresFinaForm.controls['meta'].value;

        this.dataTableClasificacion['mga'] = this.mgaValue
        this.dataTableClasificacion['pospre'] = this.pospreValue
        this.dataTableClasificacion['apropiacionDisponible'] = 0;
        this.dataTableClasificacion['aumento'] = 0;
        this.dataTableClasificacion['disminucion'] = 0;
        this.dataTableClasificacion['compromisos'] = 0;
        this.dataTableClasificacion['apropiacionDefinitiva'] = 0;
        this.dataTableClasificacion['giros'] = 0;
        this.dataTableClasificacion['subAumento'] = 0;
        this.dataTableClasificacion['subDisminucion'] = 0;
        this.dataTableClasificacion['iva'] = 0;
        this.dataTableClasificacion['arl'] = 0;
        // console.log('ARRAY',this.dataTableClasificacion)
        let repe = this.dataTableClasificaciones.filter(u =>
          u.mes == this.dataTableClasificacion['mes'] &&
          u.anioVigRecursos == this.dataTableClasificacion['anioVigRecursos'] &&
          u.auxiliar.auxiliar_ID == this.dataTableClasificacion['auxiliar'].auxiliar_ID &&
          u.fuente.fuente_ID == this.dataTableClasificacion['fuente'].fuente_ID &&
          u.actividad.actividad_ID == this.dataTableClasificacion['actividad'].actividad_ID)

        // console.log('repe',repe)
        if (repe.length != 0) {
          this.openSnackBar('ERROR', 'No se puede agregar el mismo registro', 'error')
          this.proRequirementeForm.controls.clasPresFinaForm.reset();
          this.dataTableClasificacion = {};
          return;
        }
        
          this.dataTableClasificaciones.push(this.dataTableClasificacion)
          var stringToStore = JSON.stringify(this.dataTableClasificaciones);
          ProChartStorage.setItem("dataTableClacificaciones", stringToStore);
          var fromStorage = ProChartStorage.getItem("dataTableClacificaciones");
          this.reloadDataTbl(fromStorage, 'clasificaciones');
        
       
       
        // console.log('VALUE FORM',this.proRequirementeForm.controls.clasPresFinaForm.value)
        // console.log('ARRAYSSSSS',this.dataTableClasificaciones)
      }
    }
    if (type == 'codigos') {
      //validar si el campo es numero this.proRequirementeForm.controls.codigosForm.value
      if (this.proRequirementeForm.controls.codigosForm.value && !isNaN(this.proRequirementeForm.controls.codigosForm.controls.codCategoria.value)) {
        //reset form

      } else {
        if (this.proRequirementeForm.controls.codigosForm.controls['codCategoria'].value == '' || this.proRequirementeForm.controls.codigosForm.controls['codCategoria'].value == null) {
          this.errorCodigos = true;
        } else {
          this.dataTableCodigo = this.proRequirementeForm.controls.codigosForm.controls.codCategoria.value
          let repe = this.dataTableCodigos.filter(u => u.unspsC_ID == this.dataTableCodigo['unspsC_ID'])
          if (repe.length != 0) {
            this.openSnackBar('ERROR', 'No se puede agregar el mismo registro', 'error')
            return;
          }
          this.dataTableCodigos.push(this.dataTableCodigo)
          var stringToStore = JSON.stringify(this.dataTableCodigos);
          ProChartStorage.setItem("dataTableCodigos", stringToStore);
          var fromStorage = ProChartStorage.getItem("dataTableCodigos");
          this.reloadDataTbl(fromStorage, 'codigos');
        }
      }

      this.proRequirementeForm.controls.codigosForm.reset();


    }
    // if (type == 'revisiones') {
    //   if (this.reviews.controls['area'].value == '' || this.reviews.controls['area'].value == null) {
    //     this.errorArea = true;
    //   } else if (this.reviews.controls['concepto'].value == '' || this.reviews.controls['concepto'].value == null) {
    //     this.errorConcepto = true;
    //   } else if (this.reviews.controls['observaciones'].value == '' || this.reviews.controls['observaciones'].value == null) {
    //     this.errorObservaciones = true;
    //   } else {
    //     moment.locale("es");
    //     const fechaActual = Date.now();
    //     let dataRevision = {} as dataSourceRevisionesI
    //     dataRevision.fecha = moment(fechaActual).format("DD-MM-YYYY");;
    //     dataRevision.usuario = 'Usuario Prueba';
    //     dataRevision.area = this.reviews.controls.area.value;
    //     dataRevision.concepto = this.reviews.controls.concepto.value;
    //     dataRevision.observacion = this.reviews.controls.observaciones.value || '';
    //     dataRevision.revision = false;
    //     this.dataTableRevision = dataRevision;
    //     this.dataTableRevision['uuid'] = uuid();

    //     let repe = this.dataTableRevisiones.filter(u => u.uuid == this.dataTableRevision['uuid'])
    //     if (repe.length != 0) {
    //       this.openSnackBar('ERROR', 'No se puede agregar el mismo registro', 'error')
    //       return;
    //     }
    //     let dtl = this.dataTableRevision

    //     this.dataTableRevisiones.push(dtl);
    //     var stringToStoredtl = JSON.stringify(this.dataTableRevisiones);
    //     ProChartStorage.setItem("dataTableRevisiones", stringToStoredtl);
    //     var fromStoragedtl = ProChartStorage.getItem("dataTableRevisiones");
    //     this.reloadDataTbl(fromStoragedtl, 'revisiones');
    //     return;
    //   }
    // }
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
      var fromStorage = ProChartStorage.getItem("dataTableClacificaciones");
      var objectsFromStorage = JSON.parse(fromStorage || '')
      var toFind = objectsFromStorage.filter(function (obj: any) {
        return obj.uuid == valueToFind;
      });
      var index = objectsFromStorage.findIndex((x: any) => x.uuid === valueToFind.uuid);
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
        objectsFromStorage.splice(index, 1);
        var stringToStore = JSON.stringify(objectsFromStorage);
        ProChartStorage.setItem("dataTableCodigos", stringToStore);
        this.reloadDataTbl(stringToStore, 'codigos');
      }
    }
  }

  changeInitilYears(event: any) {
    this.errInitialAppYaers = false
    if (+this.dataSolicitudID > 0) {
      // if (this.isDataTemporal = true) {
      this.servicesinitialApp.getAllInitialApropriationTemp(+this.dataRequirementID, event.value, +this.dataSolicitudID).subscribe(data => {
        const ValAppIni = String(data.data.valorApropiacion_Incial)
        const VAL_APP_INI = this.assignCurrencyPipe(ValAppIni)
        const ValAppAnio = String(data.data.valorApropiacionAnio)
        const VAL_APP_ANIO = this.assignCurrencyPipe(ValAppAnio)
        const ValAppFin = String(data.data.valorApropiacion_Final)
        const VAL_APP_FIN = this.assignCurrencyPipe(ValAppFin)

        this.initialAppro.setValue({
          valorApropiacion_Incial: VAL_APP_INI,
          anio_Vigencia: data.data.anio_Vigencia,
          valorApropiacionAnio: VAL_APP_ANIO,
          valorApropiacion_Final: VAL_APP_FIN,
        })
        this.currencyInputAppro();
      })
    } else {
      this.servicesinitialApp.getAllInitialApropriation(+this.dataRequirementID, event.value).subscribe(data => {
        if (data.status == 200) {
          const ValAppIni = String(data.data.valorApropiacion_Incial)
          const VAL_APP_INI = this.assignCurrencyPipe(ValAppIni)
          const ValAppAnio = String(data.data.valorApropiacionAnio)
          const VAL_APP_ANIO = this.assignCurrencyPipe(ValAppAnio)
          const ValAppFin = String(data.data.valorApropiacion_Final)
          const VAL_APP_FIN = this.assignCurrencyPipe(ValAppFin)

          this.initialAppro.setValue({
            valorApropiacion_Incial: VAL_APP_INI,
            anio_Vigencia: data.data.anio_Vigencia,
            valorApropiacionAnio: VAL_APP_ANIO,
            valorApropiacion_Final: VAL_APP_FIN,
          })
          this.currencyInputAppro();
        } else if (data.status == 404) {
          let Data: string[] = [];
          Data = Object.values(data.data);
          let errorMessages = '';
          Data.map(item => {
            errorMessages += item + '. ';
          });
          this.errInitialAppYaers = true
          this.msjInitialAppYaers = errorMessages
          // this.openSnackBar('Error', data.message, 'error')
        }
      })
    }

  }
  getAllReviews(Modificacion_ID: number) {
    this.reviewsUpTemporal = [];
    this.serviceReviews.getAllReviews(Modificacion_ID).subscribe((data: any) => {
      this.dataTableRevisiones = data.data.items;
      if (this.viewTableReviews == true) {
        this.dataSourceRevisionesView = new MatTableDataSource(this.dataTableRevisiones)
      } else if (this.viewTableReviewsEdit == true) {
        this.reviewsUpTemporal = this.dataTableRevisiones;
        this.dataSourceRevisiones = new MatTableDataSource(this.dataTableRevisiones)
      }
    });
  }


  btnReviews(idReviews: any, type: string) {
    const fechaActual = Date.now();
    this.loading = true;
    if (type == 'add') {
      if (this.reviews.controls['area'].value == '' || this.reviews.controls['area'].value == null) {
        this.errorArea = true;
      } else if (this.reviews.controls['concepto'].value == '' || this.reviews.controls['concepto'].value == null) {
        this.errorConcepto = true;
      } else if (this.reviews.controls['observaciones'].value == '' || this.reviews.controls['observaciones'].value == null) {
        this.errorObservaciones = true;
      } else {
        moment.locale("es");
        const fechaActual = Date.now();
        let dataRevision = {} as dataSourceRevisionesI
        dataRevision.revision_ID = uuid();
        dataRevision.fecha = moment(fechaActual).format("DD-MM-YYYY");;
        dataRevision.usuario = 'Usuario Prueba';
        dataRevision.area = this.reviews.controls.area.value;
        dataRevision.concepto = this.reviews.controls.concepto.value;
        dataRevision.observacion = this.reviews.controls.observaciones.value || '';
        if (this.reviews.controls.concepto.value == 'Aprobado') {
          dataRevision.revision = true;
        } else {
          dataRevision.revision = false;
        }
        this.dataTableRevision = dataRevision;
        let repe = this.dataTableRevisiones.filter(u => u.concepto == dataRevision.concepto && u.area == dataRevision.area && u.observacion == dataRevision.observacion)
        if (repe.length != 0) {
          this.openSnackBar('ERROR', 'No se puede agregar el mismo registro', 'error')
          return;
        }
        let dtl = this.dataTableRevision

        this.dataTableRevisiones.push(dtl);
        this.dataSourceRevisiones = new MatTableDataSource(this.dataTableRevisiones)
        this.reviews.reset();
      }
    }

    if (type == 'Delete') {
      if (typeof idReviews !== 'string') {
        let reviewsDelete = {} as deleteReviewsI
        reviewsDelete.modificacion_ID = +this.dataRequirementID
        reviewsDelete.revisiones = [idReviews]
        this.serviceReviews.deleteReviews(reviewsDelete).subscribe((data: any) => {

          if (data.status != 200) {
            this.openSnackBar('ERROR', data.message, 'error')
          }

          this.getAllReviews(+this.dataRequirementID)

          this.loading = false;
        }, error => {
        });
      } else {

        var fromStorage = this.dataTableRevisiones
        var index = fromStorage.findIndex((x: any) => x.revision_ID === idReviews);
        if (index >= 0) {
          this.dataTableRevisiones.splice(index, 1);
          this.dataSourceRevisiones = new MatTableDataSource(this.dataTableRevisiones)
        }
      }



    }
    if (type == 'Revisar') {
      var fromStorage = this.dataTableRevisiones
      let reviewsData = {} as postReviewsI

      reviewsData.modificacion_ID = +this.dataRequirementID
      for (let i = 0; i < fromStorage.length; i++) {
        if (typeof fromStorage[i].revision_ID == 'string') {
          let reviewsData = {} as postReviewsI
          reviewsData.modificacion_ID = +this.dataRequirementID
          let reviews = {} as reviewsI
          reviews.revisado = false
          reviews.concepto = fromStorage[i].concepto
          reviews.observacion = fromStorage[i].observacion
          reviews.area_ID = fromStorage[i].area.area_ID
          this.reviewsAdd.push(reviews)
        }
      }
      reviewsData.revisiones = this.reviewsAdd
      this.serviceReviews.postReviews(reviewsData).subscribe((data: any) => {
        if (data.status != 200) {
          this.openSnackBar('ERROR', data.message, 'error')
          this.loading = false;
        } else {
          this.openSnackBar('Revisiones guardadas correctamente', data.message, 'success')
          this.getAllReviews(+this.dataRequirementID)
          this.loading = false;
        }
      }, error => {
      });

      if (this.reviewsCheck.length != 0) {
        let putUpdateReviews = {} as putUpdateReviewsI
        putUpdateReviews.modificacion_ID = +this.dataRequirementID
        putUpdateReviews.revisiones = this.reviewsCheck
        this.serviceReviews.putUpdateReviews(putUpdateReviews).subscribe((data: any) => {
          if (data.status != 200) {
            this.openSnackBar('ERROR', data.message, 'error')
          }
          if (data.status == 200) {
            this.openSnackBar('Revisado correctamente', data.message, 'success')
          }
          this.getAllReviews(+this.dataRequirementID)
          this.loading = false;
        }, error => {
        });
      } else {
      }

      if (sessionStorage.getItem('mga') == 'taskTray') {
        this.router.navigate(['/WAPI/PAA/BandejaDeTareas']);
      } else {
        this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + +this.dataSolicitudID])

      }
    }

  }
  showOptions(revisado: any, objectReview: any) {
    if (typeof objectReview !== 'string') {
      let objectReviews = {} as revisionesI
      objectReviews.revisado = revisado
      objectReviews.revision_ID = objectReview
      if (this.reviewsCheck.length > 0) {
        this.reviewsCheck.forEach((element: any) => {
          let index = this.reviewsCheck.findIndex((x: any) => x.revision_ID === objectReviews.revision_ID);
          if (index >= 0) {
            this.reviewsCheck.splice(index, 1);
          }
          this.reviewsCheck.unshift(objectReviews)
        });
      } else {
        this.reviewsCheck.push(objectReviews)
      }
    } else {
    }

  }

  versionActual(event: any) {
    // actualizamos el index seleccionado
    this.selectedIndex = event.index;
    if (event.index == 1) {
      this.getDataAprobad(+this.dataProjectID, +this.reqID);
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

  openBudgetModification(type: string, element: any) {
    if (this.typePage == 'Vista') {
      type = 'ver'
    }
    const dialogRef = this.dialog.open(BudgetModificationComponent, {
      width: '800px',
      height: '500px',
      data: { type, element },
    });
    dialogRef.afterClosed().subscribe(result => {

      let repe = this.dataTableClasificaciones.filter(u => u.uuid == element['uuid'])
      if (repe.length != 0) {
        //eliminar el igual a uuid
        let index = this.dataTableClasificaciones.findIndex((x: any) => x.uuid === element['uuid']);
        if (index >= 0) {
          this.dataTableClasificaciones.splice(index, 1);
        }
      }
      this.dataTableClasificaciones.push(element)
      var stringToStore = JSON.stringify(this.dataTableClasificaciones);
      ProChartStorage.setItem("dataTableClacificaciones", stringToStore);
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
function autocompleteAuxiliarValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteAuxiliar': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null  /* valid option selected */
    }
    return { 'invalidAutocompleteString': { value: control.value } }
  }
}









