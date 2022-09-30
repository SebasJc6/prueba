export interface getRequestTrayI {
    status: number,
    message: any,
    title: any,
    data: dataRequestTrayI,
}


export interface dataRequestTrayI {
    hasItems: boolean,
    items: itemsRequestTrayI[],
    calculados: any,
    total: number,
    page: number,
    pages: number
}

export interface itemsRequestTrayI {
    idSolicitud: number,
    numeroSolicitud: number,
    vigencia: number,
    fechaPresentacion: Date,
    codigoProyecto: number,
    nombreProyecto: string,
    version: number,
    solicitante: string,
    estado: string,
    fechaAprobacion_rechazo: Date
}

export interface filterRequestTrayI {
    NumeroSolicitud: number,
    Vigencia: number,
    FechaPresentacion: Date,
    CodigoProyecto: number,
    NombreProyecto: string,
    Version: number,
    Solicitante: string,
    Estado: string,
    FechaAprobacion_rechazo: Date,
    page: string,
    take: number,
    columna: string,
    ascending: boolean
}