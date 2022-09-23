import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { getAllDependenciesDataI, getAllSelectionModeDataI, getInfoToCreateReqDataI } from 'src/app/Models/ModelsPAA/propertiesRequirement/propertiesRequirement.interface';
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

const CODIGOS_DATA: TableCodigos[] = [
  { codigo: 78111800, descripcion: 'Transporte de pasajeros por la carretera' },
  { codigo: 80111623, descripcion: 'Servicios temporales de compras y logística' }
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
  listDependencies: any;
  listSelcMode: any;
  dependencieFil!: string[];
  values: any;
  control = new FormControl('');
  filDependencies!: Observable<string[]>;
  filSelcMode!: Observable<string[]>;
  dependencieId: string = '';
  selcModeId: string = '';

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
      dependenciaOri: new FormControl(),
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
      tipoSer: new FormControl(),
      perfil: new FormControl(),
      valorHonMes: new FormControl(),
      cantidadCont: new FormControl(),
      descripcion: new FormControl()
    })

  })



  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['mes', 'vigenciaRecursos', 'auxiliar', 'detalleFuente', 'actividad', 'meta', 'fuente', 'fuenteMSPS', 'MGA', 'pospre', 'apropiacionDisponible', 'aumento', 'disminucion', 'apropiacionDefinitiva', 'compromisos', 'giros', 'acciones'];
  dataSource = ELEMENT_DATA;

  //INFORMACION PARA LA TABLA CODIGOS UNSPSC
  codigosColumns: string[] = ['codigoUNSPSC', 'descripcion', 'eliminar'];
  dataCodigos = CODIGOS_DATA;

  //INFORMACION PARA LA TABLA REVICIONES
  revisionesColumns: string[] = ['fecha', 'usuario', 'area', 'concepto', 'observacion', 'revision', 'eliminar'];
  dataRevisiones = REVISION_DATA;


  constructor(
    public serviceProject: ProjectService,
    public serviceProRequirement: PropertiesRequirementService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private formbuilder: FormBuilder
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
    //  this.getAllDependencies();
    //this.getAllSelectionMode();
    this.getAllContractualAction();
  }

  ngOnInit(): void {
    this.ngAfterViewInit();
    this.uploadDropdownLists();
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
  cancel() {
    this.router.navigate(['/PAA/Requerimientos/' + this.dataProjectID])
  }

  saveForm() {
    this.proRequirementeForm.controls.infoBasicaForm.controls['dependenciaDes'].setValue(this.dependencieId);
    this.proRequirementeForm.controls.infoBasicaForm.controls['modalidadSel'].setValue(this.selcModeId);
    console.log(this.proRequirementeForm.value)
  }

  displayFn(value: any) {
    console.log('value', value)
    return value ? value.codigo : ''
  }


  onSelectionChange(event: any, tipo: string) {
    if (tipo === 'dependenciaDes') {
      this.dependencieId = event.option.value.dependencia_ID;
      console.log('onSelectionChange dependenciaDes', event.option.value);
      console.log('onSelectionChange dependenciaDes', event.option.value.dependencia_ID);
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
  }




}







