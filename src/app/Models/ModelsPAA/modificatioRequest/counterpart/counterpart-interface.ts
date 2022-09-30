export interface getCounterpartI {
    status: number,
    messag: any,
    title: any,
    data: CounterpartInterface[],
}

export interface CounterpartInterface {
    proyecto_Fuente_ID: number,
    proyecto_ID: number,
    descripcion: string,
}
