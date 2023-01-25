export interface getReportsAllI {
    status: number,
    message: number,
    title: number,
    data: dataReportsAllI[]
}

export interface dataReportsAllI {
    reporteID: number,
    numeroReporte: number,
    nombre: string,
    descripcion: string
}


export interface getReportsNameI {
    status: number,
    message: number,
    title: number,
    data: string[]
}