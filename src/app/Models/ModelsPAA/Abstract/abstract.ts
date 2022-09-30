export interface getAbstractI {
    status: number,
    message: any,
    title: any,
    data: dataAbstractI
}

export interface dataAbstractI {
    proyectoID: number,
    codigoProyecto: number,
    nombreProyecto: string,
    anio: number,
    subsecretaria: string,
    dependenciaOrigen: string,
    responsable: responsibleAbstractI,
    unidadContratacion: string,
    apropiacionInicial: number,
    apropiacionDefinitiva: number,
    ejecucionAcumulada: number,
    ejecucionApropPCT: number,
    porEjecutar: number,
    giroAcumulado: number,
    ejecucionGiroPCT: number,
    reservaConstituida:number,
    girosReserva: number,
    ejecucionGirosPCT: number
}

export interface responsibleAbstractI {
    responsable_ID: number,
    nombre: string,
    telefono: number,
    correo: string
}