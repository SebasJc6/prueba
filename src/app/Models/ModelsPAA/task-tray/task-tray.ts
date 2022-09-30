export interface getTaskTrayI {
    status: number,
    messag: any,
    title: any,
    data: dataTaskTrayI
}

export interface dataTaskTrayI {
    hasItems: boolean,
    items: itemsTaskTrayI[],
    calculados: any,
    total: number,
    page: number,
    pages: number
}

export interface itemsTaskTrayI {
    requerimiento_Temp_ID: number,
    fecha: Date,
    codigoProyecto: number,
    numeroRequerimiento: number,
    cantidadAjustes: number
}

export interface filterTaskTrayI {
    Fecha: Date,
    CodigoProyecto: number,
    NumeroRequerimiento: number,
    CantidadAjustes: number,
    page: string,
    take: number,
    columna: string,
    ascending: boolean
}