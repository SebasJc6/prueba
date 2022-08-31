export interface getRequerimentsI {
    status: number,
    message: string,
    title: string,
    data: [
        hasItems: boolean,
        items: dataTableRequerimentI,
        page: number,
        pages: number,
        total: number
    ]
}

export interface dataTableRequerimentI {
    requerimientoId: number,
    numeroRequerimiento: number,
    dependenciaDestino: string,
    descripcion: string,
    estado: string
}