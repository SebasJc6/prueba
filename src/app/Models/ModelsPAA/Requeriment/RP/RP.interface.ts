

export interface getRPsI {
    status: number;
    message: string;
    title: string;
    data: dataRPsI[];
}

export interface dataRPsI {
    rP_ID: number;
    numeroRP: number;
    numeroCDP: number;
    numeroContrato: number;
    nit: number;
    fechaRP: string;
    contratista: string;
    pendienteDistribuir: number;
    valorAnulado: number;
    valorDistribuir: number;
    valorInicial: number;
    actividades: actividadI[];
}

export interface actividadI {
    clasificacion_ID: number;
    actividad: string;
    pospre: string;
    mga: string;
    auxiliar: string;
    fuente: string;
    apropiacionDispobible: number;
    valoresDistribuidos: number;
}

export interface postRPsI{
    rps:RPsI[]
}
export interface RPsI{
    rP_ID:number,
    cadenas: cadenaRPsI[]
}
export interface cadenaRPsI{
    clasificacion_ID: number;
    valoresDistribuidos: number;
}