import { dataTableRequerimentI } from "../Requeriment/Requeriment.interface"

export interface getProjectI {
    status: number,
    message: string,
    title: string,
    data: [
        hasItems: boolean,
        items: dataTableProjectI,
        page: number,
        pages: number,
        total: number
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





