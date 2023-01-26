export interface getStockOrdersI {
    data: dataStockOrdersI,
    message: string,
    status: number,
    title: string
}

export interface dataStockOrdersI {
    calculados: calculadosStockOrdersI[],
    hasItems: boolean,
    items: itemsStockOrdersI[],
    page: number,
    pages: number,
    total: number,
}

interface calculadosStockOrdersI {
    detalle: string,
    valor: number
}

export interface itemsStockOrdersI {
    fechaGiro: string
    giro_ID: number,
    numRP: number,
    numeroOrden: number,
    valorDistribuido: number,
    valorOrdenPago: number,
    valorPorDistribuir: number,
    vigencia: number
}

export interface filterStockOrdersI {
    Vigencia: number,
    NumeroOrden: number,
    FechaGiro: Date,
    RP: number,
    page: string,
    take: number,
    columna: string,
    ascending: boolean
}