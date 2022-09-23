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




export interface modificationRequestI {
  idSolicitud: number,
  proyecto_COD: number,
  numero_Modificacion: number,
  nombreProyecto: string,
  datos: ModificationRequestByRequestIdI,
  observacion: string,
  archivos: archivosI
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
  modificacion_ID: number,
  isContrapartida: boolean,
  numeroRequerimiento: number,
  dependenciaDestino: string,
  descripcion: string,
  actuacionContractual: string,
  numeroContrato: string,
  tipoContrato: string,
  perfil: string,
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
  Honorarios: string,
  SaldoRequerimiento: string,
  ValorAumenta: string,
  ValorDisminuye: string,
  NuevoSaldoApropiacion: string,
  ModalidadSeleccion: string,
  page: string,
  take: number,
  columna: string,
  ascending: boolean
}