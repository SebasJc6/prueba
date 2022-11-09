export interface getCDPsI {
    status: number,
    messag: any,
    title: any,
    data: dataCDPsI
}


export interface dataCDPsI {
    hasItems: boolean,
    items: itemsCDPsI[],
    calculados: calculadosCDPsI[],
    total: number,
    page: number,
    pages: number
}


export interface itemsCDPsI {
    cdP_ID: number,
    fechaAnulacion: Date,
    fechaCDP: Date,
    numeroCDP: number,
    cantidadRPs: number,
    valorAnulacion: number,
    valorDistribuido: number,
    valorFinal: number,
    valorRP: number,
    valorinicial: number,
    vigencia: number
}


export interface calculadosCDPsI {
    detalle: string,
    valor: number
}


export interface filterCDPsI {
    Vigencia: number,
    CDP: number,
    Fecha_CDP: string,
    page: string,
    take: number,
    columna: string,
    ascending: boolean
}