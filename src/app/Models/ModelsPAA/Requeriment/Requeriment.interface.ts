import { calculadosI } from "../modificatioRequest/ModificationRequest.interface"

export interface dataTableRequerimentI {
    requerimientoId: number,
    numeroRequerimiento: number,
    dependenciaDestino: string,
    descripcion: string,
    estado: string
}


export interface filterRequerimentI {
    NumeroRequerimiento: number,
    DependenciaDestino: string,
    Descripcion: string,
    Estado: string
    page: string,
    take: number,
    columna: string,
    ascending: boolean
}




export interface getDataRequerimentI {
    status: number,
    message: string,
    title: string,
    data: dataI
}

export interface dataI{
    hasItems: boolean,
    items: dataTableDataRequerimentI,
    calculados : calculadosI,
    total: number,
    page: number,
    pages: number,
}
export interface dataTableDataRequerimentI {
    requerimientoID: number,
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

export interface filterDataRequerimentI {
    page: string,
    take: number,
    NumeroRequerimiento: number,
    Descripcion: string
}
