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


export interface getReportBase64I{
    status: number,
    message: number,
    title: number,
    data: {
        fileAsBase64: string,
        fileName: string
    }
}