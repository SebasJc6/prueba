import { CurrencyPipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { concat, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { postDataModificationsI, postDataModifRequerimentsI, postDataModReqI, postModificationRequestI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { dataSourceClasificacionesI, dataSourceRevisionesI, getAllAuxiliarDataI, getAllUNSPSCDataI, getInfoToCreateReqDataI, saveDataEditDatosI, requerimientoI, saveDataEditI, verifyDatacompleteI, verifyDataSaveI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
import { deleteReviewsI, postReviewsI, putUpdateReviewsI, reviewsI, revisionesI } from 'src/app/Models/ModelsPAA/propertiesRequirement/Reviews/reviews.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';
import { PropertiesRequirementService } from 'src/app/Services/ServicesPAA/propertiesRequirement/properties-requirement.service';
import { ReviewsService } from 'src/app/Services/ServicesPAA/propertiesRequirement/reviews/reviews.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';
import { v4 as uuid } from 'uuid';
import { BudgetModificationComponent } from './budget-modification/budget-modification.component';



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
  dependenciaRec: string = '';
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
  dependencieDes = new FormControl('');
  idPerfil = 0
  formVerify = {} as verifyDataSaveI;
  formVerifyComplete = {} as verifyDatacompleteI;
  formModificationRequest = {} as saveDataEditI
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
      tipoCont: new FormControl(),
      perfil: new FormControl(),
      valorHonMes: new FormControl(),
      cantidadCont: new FormControl(),
      descripcion: new FormControl()
    }),
    clasPresFinaForm: this.formbuilder.group({
      numModificacion: new FormControl({ value: '', disabled: true }),
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
    }),
    initialAppro: this.formbuilder.group({
      apropIni_ID: new FormControl({ value: 1, disabled: true }),
      vigencia0: new FormControl({ value: 2020, disabled: true }),
      valor0: new FormControl({ value: 20000000, disabled: true }),
      vigencia1: new FormControl({ value: 2021, disabled: true }),
      valor1: new FormControl({ value: 40000000, disabled: true }),
      vigencia2: new FormControl({ value: 2022, disabled: true }),
      valor2: new FormControl({ value: 60000000, disabled: true }),
      valorTotal: new FormControl({ value: 120000000, disabled: true })
    }),

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
    tipoContAct: new FormControl({ value: 0, disabled: true }),
    perfilAct: new FormControl({ value: 0, disabled: true }),
    valorHonMesAct: new FormControl({ value: '', disabled: true }),
    cantidadContAct: new FormControl({ value: 0, disabled: true }),
    descripcionAct: new FormControl({ value: '', disabled: true }),

    vigencia0Act: new FormControl({ value: 2020, disabled: true }),
    valor0Act: new FormControl({ value: 20000000, disabled: true }),
    vigencia1Act: new FormControl({ value: 2021, disabled: true }),
    valor1Act: new FormControl({ value: 40000000, disabled: true }),
    vigencia2Act: new FormControl({ value: 2022, disabled: true }),
    valor2Act: new FormControl({ value: 60000000, disabled: true }),
    valorTotalAct: new FormControl({ value: 120000000, disabled: true })
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
    tipoContRew: new FormControl({ value: 0, disabled: true }),
    perfilRew: new FormControl({ value: 0, disabled: true }),
    valorHonMesRew: new FormControl({ value: '', disabled: true }),
    cantidadContRew: new FormControl({ value: 0, disabled: true }),
    descripcionRew: new FormControl({ value: '', disabled: true }),

    vigencia0Rew: new FormControl({ value: 2020, disabled: true }),
    valor0Rew: new FormControl({ value: 20000000, disabled: true }),
    vigencia1Rew: new FormControl({ value: 2021, disabled: true }),
    valor1Rew: new FormControl({ value: 40000000, disabled: true }),
    vigencia2Rew: new FormControl({ value: 2022, disabled: true }),
    valor2Rew: new FormControl({ value: 60000000, disabled: true }),
    valorTotalRew: new FormControl({ value: 120000000, disabled: true })
  })
  submitted = false;
  public selectedIndex = 0;
  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['mes', 'anioVigRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  displayedColumnsAct: string[] = ['mes', 'anioVigRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros'];
  displayedColumnsRew: string[] = ['mes', 'anioVigRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros'];
  //INFORMACION PARA LA TABLA CODIGOS UNSPSC
  codigosColumns: string[] = ['codigoUNSPSC', 'descripcion', 'eliminar'];
  codigosColumnsAct: string[] = ['codigoUNSPSC', 'descripcion'];
  codigosColumnsRew: string[] = ['codigoUNSPSC', 'descripcion'];
  //INFORMACION PARA LA TABLA REVICIONES
  revisionesColumns: string[] = ['fecha', 'usuario', 'area', 'concepto', 'observacion', 'revision', 'eliminar'];
  //Objeto con la informacion de acceso del Usuario
  AccessUser: string = '';
  viewsReviews: boolean = false;
  viewsBtnReviews: boolean = false;
  viewVersionReview: boolean = false;
  dataSourceCodigos!: MatTableDataSource<getAllUNSPSCDataI>;
  dataSourceCodigosAct!: MatTableDataSource<getAllUNSPSCDataI>;
  dataSourceClasificaciones!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceClasificacionesAct!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceRevisiones!: MatTableDataSource<dataSourceRevisionesI>;
  dataSourceClasificacionesRew!: MatTableDataSource<dataSourceClasificacionesI>;
  dataSourceCodigosRew!: MatTableDataSource<getAllUNSPSCDataI>;

  constructor(
    public serviceProject: ProjectService,
    public serviceProRequirement: PropertiesRequirementService,
    public serviceModRequest: ModificationRequestService,
    public serviceReviews: ReviewsService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private formbuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthenticationService,
  ) { }

  ngAfterViewInit() {
    this.dataSolicitudID = this.activeRoute.snapshot.paramMap.get('idSol') || '';
    this.dataRequirementID = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.typePage = this.activeRoute.snapshot.paramMap.get('type') || '';
    ////console.log(+this.dataProjectID, +this.dataRequirementID)
    this.getInfoToCreateReq(+this.dataProjectID);
    // if (this.dataSolicitudID == 'true') {
    //   console.log('aprobado')
    //   this.getDataAprobad(+this.dataProjectID, +this.dataRequirementID);
    // } else

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
    this.getAllConcepts();
    this.verifyNumReq();
    this.verifyRangeSararial();
    this.valuePerfil();
  }

  ngOnInit(): void {
    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();
    console.log(this.AccessUser);

    // this.loading = true;
    this.ngAfterViewInit();
    this.uploadDropdownLists();
    this.currencyInput();
    this.valueRequired();

    if (this.typePage == 'Nuevo') {
      this.dataRequirementNum = this.dataRequirementID;
      this.viewVersionMod = true;
    } else if (this.typePage == 'Vista') {
      this.getDataAprobad(+this.dataProjectID, +this.dataRequirementID);
      this.viewBtnVersion = false;
      this.viewVersionMod = false;
      this.viewVersion = true;
      this.viewActionCancel = true;
    } else {
      this.getAllDataTemporal(+this.dataProjectID, +this.dataSolicitudID, +this.dataRequirementID);
    }
    if (this.AccessUser == 'Revisor') {

      this.viewsBtnReviews = true;
      this.viewsReviews = true;
    } else {
      this.viewVersionMod = true;
      this.errorNumReq = false;
      this.errorVerifyNumReq = false;
    }
    this.getAllReviews(+this.dataRequirementID);
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

  //exampole

  // public validation_msgs = {
  //   'auxiliar': [
  //     { type: 'invalidAutocompleteAuxiliar', message: 'Contact name not recognized. Click one of the autocomplete options.' },
  //     { type: 'required', message: 'auxiliar is required.' }
  //   ],
  //   'phoneLabelAutocompleteControl': [
  //     { type: 'invalidAutocompleteString', message: 'Phone label not recognized. Click one of the autocomplete options.' },
  //     { type: 'required', message: 'Phone label is required.' }
  //   ]
  // }
  // private _filterContacts(codigoAuxiliar: string): getAllAuxiliarDataI[] {
  //   if (codigoAuxiliar === '') {
  //     return this.allAuxiliar.slice()
  //   }
  //   const filterValue = codigoAuxiliar.toLowerCase()
  //   return this.allAuxiliar.filter(option => option.codigoAuxiliar.toLowerCase().includes(filterValue))
  // }
  //

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
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.mesSeleccion.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorMesSeleccion = value.length > 0 ? false : true;
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.mesOfertas.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorMesOferta = value.length > 0 ? false : true;
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.mesContrato.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorMesContrato = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.duracionMes.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDuratioMes = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.duracionDias.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDurationDia = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.modalidadSel.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorModalidad = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.actuacionCont.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorActuacion = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.cantidadCont.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorCantContrato = false
    })
    this.proRequirementeForm.controls.infoBasicaForm.controls.descripcion.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(value => {
      this.errorDescripcionCont = false
    })

  }
  getInfoToCreateReq(projectId: number) {
    this.serviceProRequirement.getInfoToCreateReq(projectId).subscribe((dataProject) => {
      ////console.log(data)
      this.getInfoToProject = dataProject.data;
      this.codProject = this.getInfoToProject.codigoProyecto;
      this.nomProject = this.getInfoToProject.nombreProyecto;
      this.dependenciaRec = this.getInfoToProject.dependenciaOrigen;
      this.proRequirementeForm.controls.infoBasicaForm.controls['codigoPro'].setValue(this.codProject);
      this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaOri'].setValue(this.dependenciaRec);
      ////console.log(this.nomProject, this.codProject)
    })
  }


  getDependenciesByCod() {
    this.proRequirementeForm.controls.infoBasicaForm.controls.dependenciaDes.valueChanges.pipe(
      // debounceTime(1000), // Espera 1 segundo antes de emitir el valor del input
      distinctUntilChanged()  // Evita que se emita el valor si es igual al ultimo valor que se emitió
    ).subscribe(val => {
      this.serviceProRequirement.getDependenceElastic(val || '').subscribe((dataDependencie) => {
        this.listDependencies = dataDependencie.data;
        // //console.log(this.dependencieFil)
        ////console.log(dataDependencie)
      })
    }) || '';
  }

  getSelectionModeByCod() {
    this.proRequirementeForm.controls.infoBasicaForm.controls.modalidadSel.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getSelectionModeElastic(val || '').subscribe((dataSelcMode) => {
        this.listSelcMode = dataSelcMode.data;
        // //console.log(this.listSelcMode)
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
      ////console.log(this.listContacType)
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
    // this.proRequirementeForm.controls.clasPresFinaForm.controls.auxiliar.valueChanges.pipe(
    //   //  this.clasPresFinaForm.controls.auxiliar.valueChanges.pipe(
    //   // debounceTime(1000),
    //   distinctUntilChanged()
    // ).subscribe(val => {
    //   this.serviceProRequirement.getAuxiliarElastic(val || '').subscribe((dataAuxuliar) => {
    //     this.listAuxiliar = dataAuxuliar.data
    //   })
    // }) || '';
  }
  getFuentesBycod() {
    this.serviceProRequirement.getFuentesByProject(+this.dataProjectID).subscribe((dataFuentes) => {
      this.listFuentes = dataFuentes.data
      // //console.log(' this.listFuentes', this.listFuentes)
    }), (err: any) => {
      //console.log('err', err)
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        ftnMSPS: ''
      })
    }
  }
  getAllActivities() {
    this.serviceProRequirement.getAllActivities(+this.dataProjectID).subscribe((dataActi) => {
      this.listActivities = dataActi.data
      //   //console.log('actividades', this.listActivities)
    })
  }
  getMGAByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.mga.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getMGAElastic(val).subscribe(dataMGA => {
        this.listMGA = dataMGA.data
        // //console.log('dataMGA', this.listMGA)
      })
    })
  }
  getPOSPREByCod() {
    this.proRequirementeForm.controls.clasPresFinaForm.controls.pospre.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getPOSPREElastic(val).subscribe(dataPOSPRE => {
        this.listPOSPRE = dataPOSPRE.data
        //console.log('dataPOSPRE', this.listPOSPRE)
      })
    })
  }
  getUNSPSCByCod() {
    this.proRequirementeForm.controls.codigosForm.controls.codCategoria.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.getUNSPSCElastic(val).subscribe(dataUNSPSC => {
        this.listUNSPSC = dataUNSPSC.data
        //console.log('dataUNSPSC', this.listUNSPSC)
      })
    })
  }
  getAllReviewsArea() {
    this.serviceProRequirement.getAllReviewsArea().subscribe(dataReviews => {
      this.allReviewsArea = dataReviews.data
      // //console.log('dataReviews',dataReviews.data)

    })
  }
  getAllConcepts() {
    this.serviceProRequirement.getAllConcepts().subscribe(dataConcept => {
      this.allConcepts = dataConcept.data
      // //console.log('dataConcept',dataConcept.data)
    })
  }
  verifyNumReq() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
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
    })
  }
  valuePerfil() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.idPerfil = val;
      //console.log('idPerfil', this.idPerfil);
    })
  }
  verifyRangeSararial() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.serviceProRequirement.verifyRangeSararial(this.idPerfil, val).subscribe(data => {
        if (data.data == false) {
          this.errorRangeSararial = true;
          this.msjVerifyRangeSararial = data.message
        } else {
          this.errorRangeSararial = false;
          this.msjVerifyRangeSararial = data.message
        }
      })
    })
  }

  getAllDataTemporal(projectId: number, requestId: number, reqTempId: number) {
    this.serviceProRequirement.getAllDataTemporal(projectId, requestId, reqTempId).subscribe(dataTemp => {
      this.dataRequirementNum = dataTemp.requerimiento.numeroRequerimiento.toString();
      //  console.log('dataTemp', dataTemp)

      this.reqID = dataTemp.requerimiento.requerimiento_ID
      //  console.log('dataTemporal', dataTemp)
      if (this.AccessUser == 'Revisor') {
        let dataReviews = dataTemp
        if (dataReviews != null) {
          //   console.log('dataApro', dataApro)
          // this.dataRequirementNum = dataReviews.requerimiento.numeroRequerimiento.toString();

          this.versionReviewForm.setValue({
            codigoProRew: dataReviews.proyecto.codigoProyecto,
            dependenciaOriRew: dataReviews.proyecto.dependenciaOrigen,
            numeroReqRew: dataReviews.requerimiento.numeroRequerimiento.toString(),
            dependenciaDesRew: dataReviews.requerimiento.dependenciaDestino,
            mesSeleccionRew: dataReviews.requerimiento.mesEstimadoInicioSeleccion.toString(),
            mesOfertasRew: dataReviews.requerimiento.mesEstimadoPresentacion.toString(),
            mesContratoRew: dataReviews.requerimiento.mesEstmadoInicioEjecucion.toString(),
            duracionMesRew: dataReviews.requerimiento.duracionMes,
            duracionDiasRew: dataReviews.requerimiento.duracionDias,
            modalidadSelRew: dataReviews.requerimiento.modalidadSeleccion,
            actuacionContRew: dataReviews.requerimiento.actuacion.actuacion_ID,
            numeroContRew: dataReviews.requerimiento.numeroDeContrato,
            tipoContRew: dataReviews.requerimiento.tipoContrato.tipoContrato_ID,
            perfilRew: dataReviews.requerimiento.perfil.perfil_ID,
            valorHonMesRew: dataReviews.requerimiento.honorarios.toString(),
            cantidadContRew: dataReviews.requerimiento.cantidadDeContratos,
            descripcionRew: dataReviews.requerimiento.descripcion,

            vigencia0Rew: dataReviews.apropiacionInicial.anioV0,
            valor0Rew: dataReviews.apropiacionInicial.valor0,
            vigencia1Rew: dataReviews.apropiacionInicial.anioV1,
            valor1Rew: dataReviews.apropiacionInicial.valor1,
            vigencia2Rew: dataReviews.apropiacionInicial.anioV2,
            valor2Rew: dataReviews.apropiacionInicial.valor2,
            valorTotalRew: dataReviews.apropiacionInicial.valorTotal
          })

          this.cadenasPresupuestalesVerRew = dataReviews.cadenasPresupuestales
          this.dataSourceClasificacionesRew = new MatTableDataSource(this.cadenasPresupuestalesVerRew)

          this.codigosVerRew = dataReviews.codsUNSPSC
          this.dataSourceCodigosAct = new MatTableDataSource(this.codigosVerRew);
        } else if (dataReviews == null) {
          // //   console.log('Message', dataAprobad.Message)
          // this.openSnackBar('Error', dataReviews.Message, 'error')
          // this.viewVersion = false
        }
      } else {
        if (dataTemp != null) {
          this.proRequirementeForm.controls.infoBasicaForm.setValue({
            numeroReq: dataTemp.requerimiento.numeroRequerimiento,
            dependenciaDes: dataTemp.requerimiento.dependenciaDestino,
            mesSeleccion: dataTemp.requerimiento.mesEstimadoInicioSeleccion.toString(),
            // mesSeleccion:'1',
            mesOfertas: dataTemp.requerimiento.mesEstimadoPresentacion.toString(),
            mesContrato: dataTemp.requerimiento.mesEstmadoInicioEjecucion.toString(),
            duracionMes: dataTemp.requerimiento.duracionMes,
            duracionDias: dataTemp.requerimiento.duracionDias,
            modalidadSel: dataTemp.requerimiento.modalidadSeleccion,
            actuacionCont: dataTemp.requerimiento.actuacion.actuacion_ID,
            numeroCont: dataTemp.requerimiento.numeroDeContrato || '',
            tipoCont: dataTemp.requerimiento.tipoContrato.tipoContrato_ID,
            perfil: dataTemp.requerimiento.perfil.perfil_ID,
            valorHonMes: dataTemp.requerimiento.honorarios.toString() || '',
            cantidadCont: dataTemp.requerimiento.cantidadDeContratos || '',
            descripcion: dataTemp.requerimiento.descripcion,
            codigoPro: dataTemp.proyecto.codigoProyecto,
            dependenciaOri: dataTemp.proyecto.dependenciaOrigen
          })
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
          // console.log('this.dataTableClasificaciones', this.dataTableClasificaciones)
          // this.codigosTemporal = dataTemp.codsUNSPSC 
          // let codTem = this.codigosTemporal.forEach(element => {
          //   return JSON.parse(element.unspsc.codUNSPSC +element.unspsc.descripcion+element.unspsc.descripcion )
          // });
          this.dataTableCodigos = dataTemp.codsUNSPSC
          this.codigosTemporal = dataTemp.codsUNSPSC
          //  console.log('codigosTemporal', this.codigosTemporal)
          var stringToStoreCod = JSON.stringify(this.codigosTemporal);
          ProChartStorage.setItem("dataTableCodigos", stringToStoreCod);
          var fromStorageCod = ProChartStorage.getItem("dataTableCodigos");
          this.reloadDataTbl(fromStorageCod, 'codigos');

          this.proRequirementeForm.controls.initialAppro.setValue({
            apropIni_ID: dataTemp.apropiacionInicial.apropIni_ID,
            vigencia0: dataTemp.apropiacionInicial.anioV0,
            valor0: dataTemp.apropiacionInicial.valor0,
            vigencia1: dataTemp.apropiacionInicial.anioV1,
            valor1: dataTemp.apropiacionInicial.valor1,
            vigencia2: dataTemp.apropiacionInicial.anioV2,
            valor2: dataTemp.apropiacionInicial.valor2,
            valorTotal: dataTemp.apropiacionInicial.valorTotal
          })
        } else {

        }
      }



    })
  }

  getDataAprobad(projectId: number, requerimetId: number) {
    this.serviceProRequirement.getDataAprobad(projectId, requerimetId).subscribe(dataAprobad => {
      let dataApro = dataAprobad.data
      // console.log('dataAprobad', dataAprobad)
      if (dataAprobad.data != null) {
        //   console.log('dataApro', dataApro)
        this.dataRequirementNum = dataApro.requerimiento.numeroRequerimiento.toString();

        this.versionActualForm.setValue({
          codigoProAct: dataApro.proyecto.codigoProyecto,
          dependenciaOriAct: dataApro.proyecto.dependenciaOrigen,
          numeroReqAct: dataApro.requerimiento.numeroRequerimiento.toString(),
          dependenciaDesAct: dataApro.requerimiento.dependenciaDestino,
          mesSeleccionAct: dataApro.requerimiento.mesEstimadoInicioSeleccion.toString(),
          mesOfertasAct: dataApro.requerimiento.mesEstimadoPresentacion.toString(),
          mesContratoAct: dataApro.requerimiento.mesEstmadoInicioEjecucion.toString(),
          duracionMesAct: dataApro.requerimiento.duracionMes,
          duracionDiasAct: dataApro.requerimiento.duracionDias,
          modalidadSelAct: dataApro.requerimiento.modalidadSeleccion,
          actuacionContAct: dataApro.requerimiento.actuacion.actuacion_ID,
          numeroContAct: dataApro.requerimiento.numeroDeContrato,
          tipoContAct: dataApro.requerimiento.tipoContrato.tipoContrato_ID,
          perfilAct: dataApro.requerimiento.perfil.perfil_ID,
          valorHonMesAct: dataApro.requerimiento.honorarios.toString(),
          cantidadContAct: dataApro.requerimiento.cantidadDeContratos,
          descripcionAct: dataApro.requerimiento.descripcion,

          vigencia0Act: dataApro.apropiacionInicial.anioV0,
          valor0Act: dataApro.apropiacionInicial.valor0,
          vigencia1Act: dataApro.apropiacionInicial.anioV1,
          valor1Act: dataApro.apropiacionInicial.valor1,
          vigencia2Act: dataApro.apropiacionInicial.anioV2,
          valor2Act: dataApro.apropiacionInicial.valor2,
          valorTotalAct: dataApro.apropiacionInicial.valorTotal
        })

        this.cadenasPresupuestalesVerAct = dataApro.cadenasPresupuestales
        this.dataSourceClasificacionesAct = new MatTableDataSource(this.cadenasPresupuestalesVerAct)

        this.codigosVerAct = dataApro.codsUNSPSC
        this.dataSourceCodigosAct = new MatTableDataSource(this.codigosVerAct);
      } else if (dataAprobad.data == null) {
        //   console.log('Message', dataAprobad.Message)
        this.openSnackBar('Error', dataAprobad.Message, 'error')
        this.viewVersion = false
      }

    })
  }
  cancel() {
    if (this.typePage == 'Nuevo') {
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


    /** traer todos los ID del arreglo dataTableCodigos */
    let idsCodigos = this.dataTableCodigos.map((item) => {
      return item.unspsC_ID = item.unspsC_ID
    })

    //     //console.log('form value', this.proRequirementeForm.value)
    // //console.log('this.proRequirementeForm.controls.infoBasicaForm.value.descripcion',this.proRequirementeForm.controls.infoBasicaForm.value.descripcion)
    // //console.log('this.proRequirementeForm.controls.infoBasicaForm.controls[descripcion].value',this.proRequirementeForm.controls.infoBasicaForm.controls['descripcion'].value)
    //    return
    if (this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['numeroReq'].value == null) {
      this.errorNumReq = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].value == null) {
      this.errorDependencia = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['mesSeleccion'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['mesSeleccion'].value == null) {
      this.errorMesSeleccion = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['mesOfertas'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['mesOfertas'].value == null) {
      this.errorMesOferta = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['mesContrato'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['mesContrato'].value == null) {
      this.errorMesContrato = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['duracionMes'].value == null) {
      this.errorDuratioMes = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['duracionDias'].value == null) {
      this.errorDurationDia = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['modalidadSel'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['modalidadSel'].value == null) {
      this.errorModalidad = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['actuacionCont'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['actuacionCont'].value == null) {
      this.errorActuacion = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['cantidadCont'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['cantidadCont'].value == null) {
      this.errorCantContrato = true;
    } if (this.proRequirementeForm.controls.infoBasicaForm.controls['descripcion'].value == '' || this.proRequirementeForm.controls.infoBasicaForm.controls['descripcion'].value == null) {
      this.errorDescripcionCont = true;
    } else {

      //  console.log('this.proRequirementeForm.value', this.proRequirementeForm.value)
      this.formVerifyComplete['infoBasica'] = this.proRequirementeForm.controls.infoBasicaForm.value

      // if (this.formEditRequirement = true) {
      //   this.dataCodigos = this.codigosTemporal
      //   this.dataClasificacion = this.cadenasPresupuestalesTemporal
      //   this.formVerifyComplete['clasificaciones'] = this.cadenasPresupuestalesTemporal
      //   this.formVerifyComplete['codigos'] = this.codigosTemporal
      // } else {
      //   this.dataCodigos = this.dataTableCodigos
      //   this.dataClasificacion = this.dataTableClasificaciones

      // }

      let dtaCla = ProChartStorage.getItem('dataTableClacificaciones')
      this.dataClasificacion = JSON.parse(dtaCla || '[]')
      this.formVerifyComplete['clasificaciones'] = JSON.parse(dtaCla || '[]')
      let dtaCod = ProChartStorage.getItem('dataTableCodigos')
      this.dataCodigos = JSON.parse(dtaCod || '[]')
      this.formVerifyComplete['codigos'] = JSON.parse(dtaCod || '[]')

      //  console.log('this.dataClasificacion', this.dataClasificacion)
      this.dataClasificacion.forEach((item: any) => {
        // if(this.formEditRequirement = true){
        //    console.log('dataClasificacion', item)
        // }
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
      //  console.log('this.dataClasificacion', this.dataClasificacion)
      this.dataCodigos.forEach((item: any) => {
        //   console.log('this.item', item)
        item.unspsC_ID = item.unspsC_ID || item.unspsc.unspsC_ID
        delete item.unspsc
        delete item.descripcion
        delete item.codigoUNSPSC
      })
      // console.log('this.dataCodigos arr', this.dataCodigos)

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
      requerimientoForm.modalidadSeleccion_Id = +this.selcModeId
      requerimientoForm.actuacion_Id = this.proRequirementeForm.controls.infoBasicaForm.value.actuacionCont
      if (requerimientoForm.actuacion_Id == 1) {
        requerimientoForm.numeroDeContrato = '0'
        requerimientoForm.tipoContrato_Id = this.proRequirementeForm.controls.infoBasicaForm.value.tipoCont
        requerimientoForm.perfil_Id = this.proRequirementeForm.controls.infoBasicaForm.value.perfil
        requerimientoForm.honorarios = +this.proRequirementeForm.controls.infoBasicaForm.value.valorHonMes
      } else {
        requerimientoForm.numeroDeContrato = this.proRequirementeForm.controls.infoBasicaForm.value.numeroCont
        requerimientoForm.tipoContrato_Id = 0
        requerimientoForm.perfil_Id = 0
        requerimientoForm.honorarios = 0
      }
      requerimientoForm.cantidadDeContratos = this.proRequirementeForm.controls.infoBasicaForm.value.cantidadCont
      requerimientoForm.descripcion = this.proRequirementeForm.controls.infoBasicaForm.value.descripcion
      requerimientoForm.version = 0
      this.formVerify.requerimiento = requerimientoForm
      this.formVerify.proj_ID = +this.dataProjectID

      this.formVerify.cadenasPresupuestales = this.dataClasificacion
      this.formVerify.codsUNSPSC = this.dataCodigos
      // console.log('this. dataCodigos  dataCodigos', this.dataCodigos)
      this.formVerify.apropiacionInicial = this.proRequirementeForm.controls.initialAppro.value
        console.log('this.formVerify', this.formVerify)

      if (this.typePage == 'Nuevo') {
        this.serviceProRequirement.postVerifyDataSaveI(this.formVerify).subscribe(dataResponse => {
          //console.log('dataResponse', dataResponse)
          if (dataResponse.status == 200) {
            // console.log('formVerifyComplete', this.formVerifyComplete)
            var stringToStoreCom = JSON.stringify(this.formVerifyComplete);
            ProChartStorage.setItem("formVerifyComplete", stringToStoreCom);
            var stringToStore = JSON.stringify(this.formVerify);
            ProChartStorage.setItem("formVerify", stringToStore);

            ProChartStorage.removeItem('dataTableClacificaciones')
            ProChartStorage.removeItem('dataTableCodigos')
            ProChartStorage.removeItem('dataTableRevisiones')
            this.openSnackBar('Se ha guardado correctamente', dataResponse.message, 'success');
            this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + +this.dataSolicitudID])
          } else {
            // console.log('dataResponse', dataResponse)
            this.openSnackBar('Error', dataResponse.message, 'error');
          }
        }, err => {
          // console.log('dataResponse', err)
          this.openSnackBar('Error', JSON.stringify(err.error.data), 'error');
        })
      } else {
        //  console.log('formModificationRequest', this.formModificationRequest)

        this.formModificationRequest.idProyecto = +this.dataProjectID
        this.formModificationRequest.observacion = 'se edito requerimiento'
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


        // console.log('this.dataRequirementID ', this.dataRequirementID)
        // console.log('formModificationRequest', this.formModificationRequest)
        this.serviceProRequirement.putModificationRequestSend(this.formModificationRequest).subscribe(dataResponse => {
          // console.log('dataResponse', dataResponse)
          if (dataResponse.status == 200) {
            this.loading = true
            this.openSnackBar('Se ha guardado correctamente', dataResponse.message, 'success');
            this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + +this.dataSolicitudID])
            this.loading = false

          } else {
            this.openSnackBar('Error', dataResponse.message && JSON.stringify(dataResponse.data), 'error');
          }
        }, err => {
          //  console.log('dataResponse', err)
          this.openSnackBar('Error', JSON.stringify(err.error.data), 'error');
        })

      }

    }
  }

  //funciones para retornar el valor al autocomplete
  displayFn(value: any) {
    ////console.log('value', value)
    return value ? value.codigo : ''
  }
  displayFnAux(value: any) {
    // //console.log('value', value)
    return value ? value.codigoAuxiliar : ''
  }
  displayFnFte(value: any) {
    // //console.log('value', value)
    return value ? value.codigoFuente.concat(' - ', value.descripcion) : ''
  }
  displayFnAct(value: any) {
    //  //console.log('value', value)
    return value ? value.codigoAct : ''
  }
  displayFnMGA(value: any) {
    //console.log('value', value)
    return value ? value.codigoMGA : ''
  }
  displayFnPOSPRE(value: any) {
    //console.log('value', value)
    return value ? value.codigo : ''
  }
  displayFnCod(value: any) {
    //console.log('value', value)
    return value ? value.codigoUNSPSC : ''
  }
  displayFnArea(value: any) {
    //console.log('value', value)
    return value ? value.nombre : ''
  }
  //funcion para obtener el id del autocomplete
  onSelectionChange(event: any, tipo: string) {
    if (tipo == 'actContractual') {
      if (event == 2) {
        //console.log('event actContractual', event)
        //diable campos formulario
        this.disabledAdicion = true
        this.disabledInicial = false
        this.proRequirementeForm.controls.infoBasicaForm.controls['numeroCont'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['tipoCont'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['tipoCont'].setValue('');
        this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].setValue('');
        this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].setValue('');
      } else {
        this.disabledAdicion = false
        this.disabledInicial = true
        this.proRequirementeForm.controls.infoBasicaForm.controls['numeroCont'].disable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['tipoCont'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['perfil'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['valorHonMes'].enable();
        this.proRequirementeForm.controls.infoBasicaForm.controls['numeroCont'].setValue('');

      }
    }
    if (tipo == 'mesClas') {
      this.errorMes = false;
    } event
    if (tipo == 'vigeRecursos') {
      this.errorVigRec = false;
    }
    if (tipo === 'dependenciaDes') {
      // this.formVerifyComplete['infoBasicaForm']['dependenciaDes'] = event.option.value
      this.dependencieId = event.option.value.dependencia_ID;
      // //console.log('onSelectionChange dependenciaDes', event.option.value);
      this.depDesValue = event.option.value
      ////console.log('onSelectionChange dependenciaDes', event.option.value.dependencia_ID);
      // this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].setValue( event.option.value.dependencia_ID);
      // this.proRequirementeForm.controls.infoBasicaForm.patchValue({
      //   dependenciaDes: event.option.value.dependencia_ID,
      // })

      this.errorDependencia = false

    }
    if (tipo === 'modalidadSel') {
      // this.formVerifyComplete['infoBasicaForm']['modalidadSel'] = event.option.value
      //  //console.log('onSelectionChange modalidadSel', event.option.value);
      this.selcModeId = event.option.value.modalidad_Sel_ID;
      // this.proRequirementeForm.controls.infoBasicaForm.patchValue({
      //   modalidadSel: event.option.value.modalidad_Sel_ID,
      // })
    }
    if (tipo == 'auxiliar') {
      // //console.log('onSelectionChange auxiliar', event.option.value);
      this.errorAux = false;
      // this.auxiliarId = event.option.value.auxiliarId;
    }
    if (tipo == 'fuente') {
      // console.log('onSelectionChange dataFuente', event.fuenteMSPS);
      this.fuenteId = event.fuente_ID
      this.errorFuentes = false;
      // //console.log('onSelectionChange dataFuente', event.option.value.fuenteMSPS);
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        ftnMSPS: event.fuenteMSPS
      })
    }
    if (tipo == 'actividad') {
      this.activityId = event.value.actividad_ID
      this.errorActi = false;
      ////console.log( this.activityId ,'actividad',event)
      this.proRequirementeForm.controls.clasPresFinaForm.patchValue({
        meta: event.value.metaODS
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

      // //console.log('codCategoria', event)
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
      // console.log('objectsFromStorage codigos', objectsFromStorage)
      this.dataSourceCodigos = new MatTableDataSource(objectsFromStorage);
    }
    if (type == 'clasificaciones') {
      console.log('objectsFromStorage clasificaciones', objectsFromStorage)
      this.dataSourceClasificaciones = new MatTableDataSource(objectsFromStorage)
    }
    // if (type == 'revisiones') {
    //   this.dataSourceRevisiones = new MatTableDataSource(objectsFromStorage)
    // }


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
        ////console.log('addclasPresFina', this.proRequirementeForm.controls.clasPresFinaForm.value)
        this.dataTableClasificacion = this.proRequirementeForm.controls.clasPresFinaForm.value
        this.dataTableClasificacion['uuid'] = uuid();
        //this.dataTableClasificacion['anioVigRecursos'] = this.proRequirementeForm.controls.clasPresFinaForm.controls['vigenciaRecu'].value;
        this.dataTableClasificacion['apropiacionDisponible'] = 0;
        this.dataTableClasificacion['aumento'] = 0;
        this.dataTableClasificacion['disminucion'] = 0;
        this.dataTableClasificacion['compromisos'] = 0;
        this.dataTableClasificacion['apropiacionDefinitiva'] = 0;
        this.dataTableClasificacion['giros'] = 0;
        let repe = this.dataTableClasificaciones.filter(u => u.uuid == this.dataTableClasificacion['uuid'])
        if (repe.length != 0) {
          //console.log('ya existe', repe);
          this.openSnackBar('ERROR', 'No se puede agregar el mismo registro', 'error')
          return;

        }
        this.dataTableClasificaciones.push(this.dataTableClasificacion)
        var stringToStore = JSON.stringify(this.dataTableClasificaciones);
        ProChartStorage.setItem("dataTableClacificaciones", stringToStore);
        var fromStorage = ProChartStorage.getItem("dataTableClacificaciones");
        this.reloadDataTbl(fromStorage, 'clasificaciones');
      }
    }
    if (type == 'codigos') {

      if (this.proRequirementeForm.controls.codigosForm.controls['codCategoria'].value == '' || this.proRequirementeForm.controls.codigosForm.controls['codCategoria'].value == null) {
        this.errorCodigos = true;
      } else {
        this.dataTableCodigo = this.proRequirementeForm.controls.codigosForm.controls.codCategoria.value
        let repe = this.dataTableCodigos.filter(u => u.unspsC_ID == this.dataTableCodigo['unspsC_ID'])
        if (repe.length != 0) {
          //console.log('ya existe', repe);
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
    if (type == 'revisiones') {
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
        dataRevision.fecha = moment(fechaActual).format("DD-MM-YYYY");;
        dataRevision.usuario = 'Ususario Prueba';
        dataRevision.area = this.reviews.controls.area.value;
        dataRevision.concepto = this.reviews.controls.concepto.value;
        dataRevision.observacion = this.reviews.controls.observaciones.value || '';
        dataRevision.revision = false;
        this.dataTableRevision = dataRevision;
        this.dataTableRevision['uuid'] = uuid();

        let repe = this.dataTableRevisiones.filter(u => u.uuid == this.dataTableRevision['uuid'])
        if (repe.length != 0) {
          //console.log('ya existe', repe);
          this.openSnackBar('ERROR', 'No se puede agregar el mismo registro', 'error')
          return;
        }
        let dtl = this.dataTableRevision
        // console.log('this.dtl 1', dtl)

        this.dataTableRevisiones.push(dtl);
        var stringToStoredtl = JSON.stringify(this.dataTableRevisiones);
        ProChartStorage.setItem("dataTableRevisiones", stringToStoredtl);
        var fromStoragedtl = ProChartStorage.getItem("dataTableRevisiones");
        this.reloadDataTbl(fromStoragedtl, 'revisiones');
        //  console.log('this.dtl 2', dtl)
        return;
      }
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
      var fromStorage = ProChartStorage.getItem("dataTableClacificaciones");
      var objectsFromStorage = JSON.parse(fromStorage || '')
      var toFind = objectsFromStorage.filter(function (obj: any) {
        return obj.uuid == valueToFind;
      });
      // find the index of the item to delete
      var index = objectsFromStorage.findIndex((x: any) => x.uuid === valueToFind.uuid);
      if (index >= 0) {
        this.dataTableClasificaciones.splice(index, 1);
        //console.log('arreglo remove', this.dataTableClasificaciones)
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
        //  //console.log('arreglo rem,ove',this.dataTableCodigos)
        objectsFromStorage.splice(index, 1);
        var stringToStore = JSON.stringify(objectsFromStorage);
        ProChartStorage.setItem("dataTableCodigos", stringToStore);
        this.reloadDataTbl(stringToStore, 'codigos');
      }
    }
    // if (type == 'revisiones') {
    //   //console.log('clasificaciones', valueToFind)

    //   var fromStorage = ProChartStorage.getItem("dataTableCodigos");
    //   var objectsFromStorage = JSON.parse(fromStorage || '')
    //   var toFind = objectsFromStorage.filter(function (obj: any) {
    //     return obj.unspsC_ID == valueToFind;
    //   });
    //   // find the index of the item to delete
    //   var index = objectsFromStorage.findIndex((x: any) => x.unspsC_ID === valueToFind);
    //   if (index >= 0) {
    //     this.dataTableCodigos.splice(index, 1);
    //     //  //console.log('arreglo rem,ove',this.dataTableCodigos)
    //     objectsFromStorage.splice(index, 1);
    //     var stringToStore = JSON.stringify(objectsFromStorage);
    //     ProChartStorage.setItem("dataTableCodigos", stringToStore);
    //     this.reloadDataTbl(stringToStore, 'revisiones');
    //   }
    // }


  }


  getAllReviews(Modificacion_ID: number) {
    this.serviceReviews.getAllReviews(Modificacion_ID).subscribe((data: any) => {
      this.dataTableRevisiones = data.data.items;
      this.dataSourceRevisiones = new MatTableDataSource(this.dataTableRevisiones)
      // console.log('this.dataSourceRevisiones', this.dataTableRevisiones)
      // console.log('data revisiones', data)
      // var stringToStore = JSON.stringify(this.dataTableRevisiones);
      // ProChartStorage.setItem("dataTableRevisiones", stringToStore);
      // this.reloadDataTbl(stringToStore, 'revisiones');
    });
  }
  btnReviews(idReviews: number, type: string) {
    this.loading = true;

    if (type == 'Agregar') {
      console.log('Agregar', this.reviews.value)
      let reviewsData = {} as postReviewsI

      reviewsData.modificacion_ID = +this.dataRequirementID
      let reviews = {} as reviewsI
      reviews.revisado = false
      reviews.concepto = this.reviews.controls.concepto.value || ''
      reviews.observacion = this.reviews.controls.observaciones.value || ''
      reviews.area_ID = this.reviews.controls.area.value.area_ID || 0
      reviewsData.revisiones = [reviews]
      console.log('reviewsData', reviewsData)
      this.serviceReviews.postReviews(reviewsData).subscribe((data: any) => {
        console.log('data', data)
        if (data.status != 200) {
          this.openSnackBar('ERROR', data.message, 'error')
          this.loading = false;

        } else {
          this.getAllReviews(+this.dataRequirementID)
          this.loading = false;

        }
      });

    }
    if (type == 'Delete') {

      // console.log('Delete', idReviews)
      let reviewsDelete = {} as deleteReviewsI
      reviewsDelete.modificacion_ID = +this.dataRequirementID
      reviewsDelete.revisiones = [idReviews]
      // console.log('reviewsDelete', reviewsDelete)
      this.serviceReviews.deleteReviews(reviewsDelete).subscribe((data: any) => {
        //   console.log('data', data)
        // if(data.Status != 200){
        //   this.openSnackBar('ERROR', data.Message, 'error')
        // }else
        if (data.status != 200) {
          this.openSnackBar('ERROR', data.message, 'error')
        }

        this.getAllReviews(+this.dataRequirementID)

        this.loading = false;

      });

    }
    if (type == 'Revisar') {

      console.log('this.reviewsUpTemporal revisado', this.reviewsUpTemporal)

      let putUpdateReviews = {} as putUpdateReviewsI
      putUpdateReviews.modificacion_ID = +this.dataRequirementID
      putUpdateReviews.revisiones = this.reviewsUpTemporal
      console.log('putUpdateReviews', putUpdateReviews)
      this.serviceReviews.putUpdateReviews(putUpdateReviews).subscribe((data: any) => {
        console.log('data', data)
        if (data.status != 200) {
          this.openSnackBar('ERROR', data.message, 'error')
        }
        if(data.status == 200){
          this.openSnackBar('Revisado correctamente', data.message, 'success')

        }
        this.getAllReviews(+this.dataRequirementID)
        this.loading = false;
      });

    }

  }
  showOptions(revisado: any, objectReview: any) {
    //  console.log('this.reviewsUp 1', this.reviewsUp)

    let objectReviews = {} as revisionesI
    objectReviews.revisado = revisado
    objectReviews.revision_ID = objectReview
    //console.log( 'objectReviews', objectReviews)    
    if (this.reviewsUpTemporal.length > 0) {
      this.reviewsUpTemporal.forEach((element: any) => {
        let index = this.reviewsUpTemporal.findIndex((x: any) => x.revision_ID === objectReviews.revision_ID);
        if (index >= 0) {
          this.reviewsUpTemporal.splice(index, 1);
        }
        this.reviewsUpTemporal.unshift(objectReviews)
      });
    } else {
      // this.reviewsUpTemporal.unshift(objectReviews)
      this.reviewsUpTemporal.push(objectReviews)
    }


    // console.log('this.reviewsUpTemporal', this.reviewsUpTemporal)


  }

  versionActual(event: any) {
    // obtenemos el index del tab
    // console.log(event.index);
    // actualizamos el index seleccionado
    this.selectedIndex = event.index;
    if (event.index == 1) {
      this.getDataAprobad(+this.dataProjectID, +this.dataRequirementID);
    }
  }

  //Metodo para llamar alertas
  openSnackBar(title: string, message: string, type: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data: { title, message, type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
  }

  openBudgetModification(element: any) {
    // console.log('element clasificacion', element)
    const dialogRef = this.dialog.open(BudgetModificationComponent, {
      width: '800px',
      height: '500px',
      data: this.dataProjectID,
    });
  }
}

var ProChartStorage = {
  getItem: function (key: any) {
    return localStorage.getItem(key);
  },
  setItem: function (key: any, value: any) {
    //console.log("prochart setItem")
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









