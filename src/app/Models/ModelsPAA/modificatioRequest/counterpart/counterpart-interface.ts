export interface getCounterpartI {
    status: number,
    messag: any,
    title: any,
    data: CounterpartInterface[],
}

export interface CounterpartInterface {
    fuente_ID: number,
    codigoFuente: string,
    descripcion: string,
    codPresupuestoRenta: string,
    codFondoBogota: string,
    fuenteMSPS: string,
    codSEGPLANFuente: string
}

export interface editCounterpartI {
    modificacion_ID: number,
    contrapartida: CounterpartI
}

export interface CounterpartI {
    fuente_ID: number,
    descripcion: string,
    valorAumenta: number,
    valorDisminuye: number
}