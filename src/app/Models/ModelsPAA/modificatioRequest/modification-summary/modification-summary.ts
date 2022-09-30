export interface getModificationSummaryI {
    status: number,
    messag: any,
    title: any,
    data: dataModificationSummaryI
}

export interface dataModificationSummaryI {
    hasItems: boolean,
    items: itemsModificationSummaryI[],
    calculados: calculadosModificationSummaryI[],
    total: number,
    page: number,
    pages: number
}

export interface itemsModificationSummaryI {
    pospre: string,
    mga: string,
    auxiliar: string,
    actividad: string,
    sumaValorAumenta: number,
    sumaValorDisminuye: number,
    diferencia: number
}

export interface calculadosModificationSummaryI {
    detalle: string,
    valor: number
}

export interface pageModificationSummaryI {
    page: string,
    take: number
}