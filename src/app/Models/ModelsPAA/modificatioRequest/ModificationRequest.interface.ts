export interface getModificationRequestI {
  status: number,
  messag: any,
  title: any,
  data: modificationRequestI,
}

export interface getModificationRequestByRequesI {
  status: number,
  messag: any,
  title: any,
  data: ModificationRequestByRequestIdI,
}

export interface getValidityByRequestI {
  status: number,
  messag: any,
  title: any,
  data: number[]
}

export interface modificationRequestI {
  idSolicitud: number,
  proyecto_COD: number,
  numero_Modificacion: number,
  nombreProyecto: string,
  proyecto_Estado: string,
  solicitud_Estado: string,
  datos: ModificationRequestByRequestIdI,
  observacion: string,
  archivos: archivosI,
  vigencia: number
}

export interface ModificationRequestByRequestIdI {
  hasItems: true,
  items: dateTableModificationI,
  calculados: calculadosI,
  total: number,
  page: number,
  pages: number
}

export interface dateTableModificationI {
  fuente: number,
  modificacion_ID: number,
  isContrapartida: boolean,
  numeroRequerimiento: number,
  dependenciaDestino: string,
  descripcion: string,
  actuacionContractual: string,
  numeroContrato: string,
  tipoContrato: string,
  perfil: string,
  requerimientoID: number,
  honorarios: number,
  saldoRequerimiento: number,
  valorAumenta: number,
  valorDisminuye: number,
  nuevoSaldoApropiacion: number,
  modalidadSeleccion: string
}

export interface calculadosI {
  detalle: string,
  valor: number
}

export interface archivosI {
  blobName: string,
  fileName: string
}

export interface filterModificationRequestI {
  NumeroRequerimiento: number,
  DependenciaDestino: string,
  Descripcion: string,
  ActuacionContractual: string,
  NumeroContrato: string,
  TipoContrato: string,
  Perfil: string,
  ModalidadSeleccion: string,
  page: string,
  take: number,
  columna: string,
  ascending: boolean
}


//Interfaz para obtener las fuentes
export interface getSourcesI {
  status: number,
  messag: any,
  title: any,
  data: Sources[],
}

//Interfaz con la información de una Fuente
export interface Sources {
  fuente_ID: number,
  codigoFuente: string,
  descripcion: string,
  codPresupuestoRenta: string,
  codFondoBogota: string,
  fuenteMSPS: string,
  codSEGPLANFuente: string
}

//Interfaces para guardar una Solicitud de Modificacion
export interface postModificationRequestI {
  idProyecto: number,
  observacion: string,
  datos: postDataModReqI[],
  contrapartidas: postModificRequestCountersI[]
}

export interface putModificationRequestI {
  idProyecto: number,
  observacion: string,
  datos: postDataModReqI[],
  contrapartidas: postModificRequestCountersI[],
  solicitudModID: number,
  deleteReqIDs: number[],
  deleteContraIDs: number[]
}

export interface postDataModReqI {
  modificacion_ID: number,
  accion: number,
  modificacion:postDataModificationsI,
}

export interface postDataModificationsI {
  proj_ID: number,
  requerimiento: postDataModifRequerimentsI,
  cadenasPresupuestales: postDataModifCadenasPresI[],
  codsUNSPSC: postDataModCodsUNSPSC[],
  apropiacionInicial: postDataModifApropiacionInicialI,
}

export interface postDataModCodsUNSPSC {
  unspsC_ID: number
}

export interface postDataModifRequerimentsI {
  anioContrato: number,
  req_ID: number,
  numeroRequerimiento: number,
  numeroModificacion: number,
  dependenciaDestino_Id: number,
  mesEstimadoInicioSeleccion: number,
  mesEstimadoPresentacion: number,
  mesEstmadoInicioEjecucion: number,
  duracionDias: number,
  duracionMes: number,
  modalidadSeleccion_Id: number,
  actuacion_Id: number,
  numeroDeContrato: string,
  tipoContrato_Id: number,
  perfil_Id: number,
  honorarios: number,
  cantidadDeContratos: number,
  descripcion: string,
  version: number
}

export interface postDataModifCadenasPresI {
  proj_ID: number,
  requerimiento_ID: number,
  cadena_Presupuestal_ID: number,
  mes: number,
  anioVigRecursos: number,
  auxiliar_ID: number,
  fuente_ID: number,
  actividad_ID: number,
  mgA_ID: number,
  pospre_ID: number,
  apropiacionDisponible: number,
  iva: number,
  arl: number,
  aumento: number,
  subAumento: number,
  subDisminucion: number,
  disminucion: number,
  compromisos: number,
  apropiacionDefinitiva: number,
  giros:number,
}

export interface postDataModifApropiacionInicialI {
  apropIni_ID: number,
  anioV0: number,
  valor0: number,
  anioV1: number,
  valor1: number,
  anioV2: number,
  valor2: number,
  valorTotal:number
}

export interface postModificRequestCountersI {
  modificacion_ID: number,
  contrapartida: postModificRequestCounterpartI
}

export interface postModificRequestCounterpartI {
  fuente_ID: number,
  descripcion: string,
  valorAumenta: number,
  valorDisminuye: number
}


//Enviar Revisiones
export interface RevisionSend {
  idSolicitud: number,
  idProject: number,
  comentarios: string,
  accion: number
}


//Interfaz para obtener Modalidad de Seleccion
export interface getModalidadDeSeleccionI {
  status: number,
  message: string,
  title: string,
  data: {
    modalidad_Sel_ID: number,
    codigo: string,
    caracteristicas: any
  }
}

//Interfaz para obtener Actuacion Contractual
export interface getActuacionI {
  status: number,
  message: string,
  title: string,
  data: {
    actuacion_ID: number,
    tipo: string
  }
}

//Interfaz para obtener Perfil Laboral
export interface getPerfilI {
  status: number,
  message: string,
  title: string,
  data: {
    perfil_ID: number,
    nombre_Perfil: string
  }
}

//Interfaz para obtener Tipo de Contrato
export interface getTipoContratoI {
  status: number,
  message: string,
  title: string,
  data: {
    tipoContrato_ID: number,
    nombre: string
  }
}