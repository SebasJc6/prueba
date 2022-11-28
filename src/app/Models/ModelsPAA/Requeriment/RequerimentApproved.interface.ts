export interface RequerimentDataI {
        modificacion_ID: number,
        accion: number,
        modificacion: MODIFICACION
    }

    export interface MODIFICACION {
        proj_ID: number,
        requerimiento: requerimiento,
        cadenasPresupuestales: cadenasPresupuestales[],
        codsUNSPSC: codsUNSPSC[],
        apropiacionInicial: apropiacionIni
    }

    export interface requerimiento {
        req_ID: number,
            numeroRequerimiento: number,
            numeroModificacion: number,
            dependenciaDestino_Id: number,
            mesEstimadoInicioSeleccion: number,
            mesEstimadoPresentacion: number,
            mesEstmadoInicioEjecucion: number,
            duracionDias: number,
            duracionMes: number,
            modalidadSeleccion_Id: number,
            actuacion_Id: number,
            numeroDeContrato: string,
            tipoContrato_ID: number,
            perfil_ID: number,
            honorarios: number,
            cantidadDeContratos: number,
            descripcion: string,
            version: number
    }

    export interface apropiacionIni {
        apropIni_ID: number,
        anioV0: number,
        valor0: number,
        anioV1: number,
        valor1: number,
        anioV2: number,
        valor2: number,
        valorTotal: number
    }

    export interface cadenasPresupuestales {
            proj_ID: number,
            requerimiento_ID: number,
            mes: number,
            anioVigRecursos: number,
            auxiliar_ID: number,
            fuente_ID: number,
            actividad_ID: number,
            mgA_ID: number,
            pospre_ID: number,
            apropiacionDisponible: number,
            aumento: number,
            disminucion: number,
            compromisos: number,
            apropiacionDefinitiva: number,
            giros: number
    }

    export interface codsUNSPSC {
        unspsC_ID: number
    }



export interface getDataI {
    data: DataI
}

export interface DataI {
    proyecto: proyectoI,
    requerimiento: requerimientoI,
    cadenasPresupuestales: cadenasPresupuestalesI[],
    codsUNSPSC: codsUNSPSCI[],
    apropiacionInicial: apropiacionIni
}

export interface proyectoI {
    proj_ID: number,
}

export interface requerimientoI {
    req_ID: number,
    numeroRequerimiento: number,
    numeroModificacion: number,
    dependenciaDestino: {
        dependencia_ID: number
    },
    mesEstimadoInicioSeleccion: number,
    mesEstimadoPresentacion: number,
    mesEstmadoInicioEjecucion: number,
    duracionDias: number,
    duracionMes: number,
    modalidadSeleccion: {
        modalidad_Sel_ID: number
    },
    actuacion: {
        actuacion_ID: number
    },
    numeroDeContrato: string,
    tipoContrato: {
        tipoContrato_ID: number
    },
    perfil: {
        perfil_ID: number
    },
    honorarios: number,
    cantidadDeContratos: number,
    descripcion: string,
    version: number
}

export interface cadenasPresupuestalesI {
    project_ID: number,
    requerimiento_ID: number,
    mes: number,
    anioVigRecursos: number,
    auxiliar: {
        auxiliar_ID: number
    },
    fuente: {
        fuente_ID: number
    },
    actividad: {
        actividad_ID: number
    },
    mga: {
        mgA_ID: number
    },
    pospre: {
        pospre_ID: number
    },
    apropiacionDisponible: number,
    aumento: number,
    disminucion: number,
    compromisos: number,
    apropiacionDefinitiva: number,
    giros: number,
    cadena_Presupuestal_ID: number,
    iva: number,
    arl: number,
    subAumento: number,
    subDisminucion: number,
}

export interface codsUNSPSCI {
    unspsC_ID: number
}
