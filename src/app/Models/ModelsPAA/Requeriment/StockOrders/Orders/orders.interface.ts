export interface getGirosI{
    status: number;
    message: string;
    title: string;
    data: dataGirosI[];
}
export interface dataGirosI{
    fechaOrdenpago: string;
    fuente: string;
    giro_ID: number;
    numeroOrden: number;
    numeroRP: number;
    pendienteDistribuir : number;
    saldoPorGirar : number;
    valorGiroAcumulado : number;
    valorOrdenPago : number;
    valorRP : number;
    actividades: actividadI[];
}
export interface actividadI{
    actividad: string;
    auxiliar: string;
    clasificacion_ID : number;
    fuente: string;
    girosAcumulados : number;
    mga: string;
    nuevoSaldo : number;
    pospre: string;
    saldoGirar : number;
    valorGirar : number;
    valorRP : number;
}

export interface postGirosI{
    requerimiento_ID : number;
    giro_ID : number;
    distribuidos : distribuidosI[];
}
export interface distribuidosI{
    clasificacion_ID : number;
    valorGirar : number;
}