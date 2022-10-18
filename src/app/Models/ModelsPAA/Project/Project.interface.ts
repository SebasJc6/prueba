import { dataTableRequerimentI } from "../Requeriment/Requeriment.interface"



export interface getProjectI {
    status: number,
    message: string,
    title: string,

    data: [
    hasItems: boolean,
    page: number,
    pages: number,
    total: number,
    items: dataTableProjectI,
    ]
}

export interface dataTableProjectI {
    proyectoID: number,
    codigoProyecto: number,
    nombre: string,
    estadoDesc: string,
    dependenciaOrigen: string,
    valorAsignado: number,
    valorTotal: number
}



export interface getRequerimentsByProjectI {
    status: number,
    message: string,
    title: string,
    data: [
        proyectoID: number,
        codigoProyecto: number,
        nombre: string,
        requerimientos: [
            hasItems: boolean,
            items: dataTableRequerimentI,
            page: number,
            pages: number,
            total: number
        ]

    ]
}

export interface responsableI {
    responsable_ID: number,
    descripcion: string,
    telefono: number,
    correo: string
}


export interface ProjectByIdI {
    proyectoID: number,
    codigoProyecto: number,
    nombre: string,
    numeroModificacion: number,
    responsable_ID: number,
    planDD_ID: number,
    dependenciaOrigen_ID: number,
    estado_ID: number,
    entidad_ID: number,
    valorAsignado: number,
    fuentes: any,
    auxiliares: any,
    valorTotal: number,
    estadoDesc: string,
    dependenciaOrigen: string,
    codDependencia: string,
    entidadNombre: string,
    responsable: responsableI
}

export interface getProjectByIdI {
    status: number,
    message: string,
    title: string,
    data: ProjectByIdI
}


export interface statusI {
    status: number,
    message: string,
    title: string
}

export interface filterProjectI{
    DependenciaOrigen: string,
    CodigoProyecto : number,
    Nombre: string,
    EstadoDesc: string,
    page: string,
    take: number,
    columna: string,
    ascending: boolean
}

//Interface para el Endpoint de Proyecto que pide id_project y id_request y obtiene todos los requerimientos de una solicitud EN DESUSO ACTUALMENTE
export interface getProjectAndRequestI {
    status: number,
    message: null,
    title: null,
    data: dataProjectAndRequestI
}

export interface dataProjectAndRequestI {
    idSolicitud: number,
    proyecto_COD: number,
    numero_Modificacion: number,
    nombreProyecto: string,
    datos: datosProjectAndRequestI,
    observacion: string,
    archivos: []
}

export interface datosProjectAndRequestI {
    hasItems: boolean,
    items: itemsProjectAndRequestI[],
    calculados: [],
    total: number,
    page: number,
    pages: number
}

export interface itemsProjectAndRequestI {
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

export interface calculadosProjectAndRequestI {
    detalle: string,
    valor: number
}

