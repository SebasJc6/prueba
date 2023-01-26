export interface getAbstractI {
    status: number,
    message: any,
    title: any,
    data: abstractDataI
}

export interface abstractDataI {
    proyectoID: number,
    codigoProyecto: number,
    nombreProyecto: string,
    anio: number,
    anios: number[],
    subsecretaria: string,
    dependenciaOrigen: string,
    responsable: responsibleAbstractI,
    unidadContratacion: string
}

export interface responsibleAbstractI {
    responsable_ID: number,
    nombre: string,
    telefono: number,
    correo: string
}

export interface getAbstractDataYear {
    data: abstractDataYearI,
    message: string,
    status: number,
    title: string
}

export interface abstractDataYearI {
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