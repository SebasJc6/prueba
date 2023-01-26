//info basica de proyecto
export interface getInfoToCreateReqI {
    status: number,
    message: string,
    title: string,
    data: getInfoToCreateReqDataI
}
export interface getInfoToCreateReqDataI {
    proj_ID: number,
    codigoProyecto: number,
    estado: string,
    nombreProyecto: string,
    numeroModificacion: number,
    dependenciaOrigen: {
        codigo:string,
        detalle:string
    }
}


//data de lista despegables
//dependencias
export interface getAllDependenciesI {
    status: number,
    message: string,
    title: string,
    data: getInfoToCreateReqDataI
}
export interface getAllDependenciesDataI {
    dependencia_ID: number,
    codigo: string,
    detalle: string,
    tipo: string
}
//modalidad se selccion
export interface getAllSelectionModeI {
    status: number,
    message: string,
    title: string,
    data: getAllSelectionModeDataI
}
export interface getAllSelectionModeDataI {
    modalidad_Sel_ID: number,
    codigo: string,
    caracteristicas: string
}
//actuacion contractual
export interface getAllContractualActionI {
    status: number,
    message: string,
    title: string,
    data: getAllContractualActionDataI
}
export interface getAllContractualActionDataI {
    actuacion_ID: number,
    tipo: string
}

//anio contrato
export interface getAllAnioI {
    status: number,
    message: string,
    title: string,
    data: []
}

//tipo de contrato
export interface getAllContacTypeI {
    status: number,
    message: string,
    title: string,
    data: getAllContacTypeDataI
}
export interface getAllContacTypeDataI {
    tipoContrato_ID: number,
    nombre: string,
}

//perfil
export interface getAllProfileI {
    status: number,
    message: string,
    title: string,
    data: getAllProfileDataI
}
export interface getAllProfileDataI {
    perfil_ID: number,
    nombre_Perfil: string
}

//Auxilias
export interface getAllAuxiliarI {
    status: number,
    message: string,
    title: string,
    data: getAllAuxiliarDataI
}
export interface getAllAuxiliarDataI {
    auxiliarId: number,
    codigoAuxiliar: string,
    descripcionAuxiliar: string,
    fuT_ID: number,
}

//fuentes
export interface getAllFuentesI {
    status: number,
    message: string,
    title: string,
    data: getAllFuentesDataI
}
export interface getAllFuentesDataI {
    fuente_ID: number,
    codigoFuente: string,
    descripcion: string,
    codPresupuestoRenta: string,
    codFondoBogota: string,
    fuenteMSPS: string,
    codSEGPLANFuente: string,
}

//Actividades
export interface getAllActivitiesI {
    status: number,
    message: string,
    title: string,
    data: getAllActivitiesDataI
}
export interface getAllActivitiesDataI {
    actividad_ID: number,
    codigo: string,
    metaODS: string,
    pospre_ID: number,
    mga_ID: number
}

//MGA
export interface getAllMGAI {
    status: number,
    message: string,
    title: string,
    data: getAllMGADataI
}
export interface getAllMGADataI {
    mgA_ID: number,
    codigoMGA: string,
    descripcion_MGA: string,
}

//POSPRE
export interface getAllPOSPREI {
    status: number,
    message: string,
    title: string,
    data: getAllPOSPREDataI
}
export interface getAllPOSPREDataI {
    pospre_ID: number,
    codigo: string,
    descripcionPOSPRE: string,
}

//UNSPSC
export interface getAllUNSPSCI {
    status: number,
    message: string,
    title: string,
    data: getAllUNSPSCDataI
}
export interface getAllUNSPSCDataI {
    unspsC_ID: number,
    codigoUNSPSC: string,
    descripcion: string,
}

//AreaRevision
export interface getAllReviewsAreaI {
    status: number,
    message: string,
    title: string,
    data: getAllReviewsAreaDataI
}
export interface getAllReviewsAreaDataI {
    area_ID: number,
    nombre: string,
}

export interface getConceptsI {
    status: number,
    message: string,
    title: string,
    data: any
}

//datatables
export interface dataSourceClasificacionesI {
    MGA: getAllMGADataI,
    POSPRE: getAllPOSPREDataI,
    actividad: getAllActivitiesDataI,
    auxiliar: getAllAuxiliarDataI,
    fuente: getAllFuentesDataI,
    mes: string,
    anioVigRecursos: number
}
export interface dataSourceRevisionesI {
    revision_ID: any;
    fecha: string,
    usuario: string,
    area: getAllReviewsAreaDataI,
    concepto: string,
    observacion: string,
    revision: boolean
}





//verify
export interface budgetStringsI {
    proj_ID: number,
    requerimiento_ID: number,
    mes: number,
    anioVigRecursos: number,
    auxiliar_ID: number,
    auxiliarCodigo: string,
    fuente_ID: number,
    fuenteCodigo: string,
    fuenteMSPS: string,
    activ_ID: number,
    actividadCodigo: string,
    meta: string,
    mgA_ID: number,
    mgaCodigo: string,
    pospre_ID: number,
    pospreCodigo: string,
    apropiacionDisponible: number,
    aumento: number,
    disminucion: number,
    compromisos: number,
    apropiacionDefinitiva: number,
    giros: number
}
export interface verifyReqI {
    status: number,
    message: string,
    title: string,
    data: boolean
}
export interface saveDataEditI {
    idProyecto: number,
    observacion: string,
    datos: saveDataEditDatosI[],
    contrapartidas: [],
    solicitudModID: number,
    deleteReqIDs: [],
    deleteContraIDs: []

}
export interface saveDataEditDatosI {
    modificacion_ID: number,
    accion: number,
    modificacion: verifyDataSaveI,
}

export interface verifyDataSaveI {
    proj_ID: number,
    requerimiento: requerimientoI,
    cadenasPresupuestales: any[],
    codsUNSPSC: any[],
    apropiacionInicial: {}
}
export interface verifyDatacompleteI {
    infoBasica: any
    clasificaciones: any
    codigos: any
}
export interface requerimientoI {
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
    anioContrato: number,
    tipoContrato_Id: number,
    perfil_Id: number,
    honorarios: number,
    cantidadDeContratos: number,
    descripcion: string,
    version: number
}
export interface responseVerifyDataSaveI {
    status: number,
    message: string,
    title: string,
    data: {
        Proj_ID: string[]
    }
}
export interface getDataAprobadaI {
    status: number,
    message: string,
    title: string,
    data: getDataTemporalI
}
//data temporal
export interface getDataTemporalI {
    proyecto: getInfoToCreateReqDataI,
    requerimiento: {
        project_ID: number,
        req_ID: number,
        requerimiento_ID: number,
        solicitud_Mod_ID: number,
        numeroRequerimiento: number,
        numeroModificacion: number,
        dependenciaDestino: {
            dependencia_ID: number,
            codigo: string
        },
        mesEstimadoInicioSeleccion: number,
        mesEstimadoPresentacion: number,
        mesEstmadoInicioEjecucion: number,
        duracionDias: number,
        duracionMes: number,
        modalidadSeleccion: {
            modalidad_Sel_ID: number,
            codigo: string
        },
        actuacion: {
            actuacion_ID: number,
            tipo: string
        },
        numeroDeContrato: string,
        anioContrato: number,
        tipoContrato: {
            tipoContrato_ID: number,
            nombre: string
        },
        perfil: {
            perfil_ID: number,
            nombre_Perfil: string
        },
        honorarios: number,
        cantidadDeContratos: number,
        descripcion: string,
        version: number,
        estado: string,
    },
    cadenasPresupuestalesTemporal: cadenasPresupuestalesI[],
    cadenasPresupuestales: cadenasPresupuestalesI[],

    aniosVigencia: number[],
    codsUNSPSC: [
        {
            unspsC_ID: number,
            codigoUNSPSC: number,
            descripcion: string
        },
    ]

}
export interface cadenasPresupuestalesI {
    cadenaPresupuestalDto: {
        uuid: string,
        project_ID: number,
        requerimiento_ID: number,
        mes: number,
        anioVigRecursos: number,
        auxiliar: {
            aux_ID: number,
            codigo: number
        },
        fuente: {
            fuente_ID: number,
            codigoFuente: number,
            detalleFuente: string,
            fuenteMSPS: number
        },
        actividad: {
            actividad_ID: number,
            codigo: number,
            metaODS: string
        },
        mga: {
            mgA_ID: number,
            codigo: number
        },
        pospre: {
            pospre_ID: number,
            codigo: number
        },
        apropiacionDisponible: number,
        aumento: number,
        disminucion: number,
        compromisos: number,
        apropiacionDefinitiva: number,
        giros: number,
        subAumento: number,
        subDisminucion: number,
    },
    project_ID: number,
    requerimiento_ID: number,
    mes: number,
    anioVigRecursos: number,
    auxiliar: {
        aux_ID: number,
        codigo: number
    },
    fuente: {
        fuente_ID: number,
        codigoFuente: number,
        detalleFuente: string,
        fuenteMSPS: number
    },
    actividad: {
        actividad_ID: number,
        codigo: number,
        metaODS: string
    },
    mga: {
        mgA_ID: number,
        codigo: number
    },
    pospre: {
        pospre_ID: number,
        codigo: number
    },
    apropiacionDisponible: number,
    aumento: number,
    disminucion: number,
    compromisos: number,
    apropiacionDefinitiva: number,
    giros: number,


}

export interface cadenaPresupuestalI {
    uuid: string,
    project_ID: number,
    requerimiento_ID: number,
    mes: number,
    anioVigRecursos: number,
    auxiliar: {
        aux_ID: number,
        codigo: number
    },
    fuente: {
        fuente_ID: number,
        codigoFuente: number,
        detalleFuente: string,
        fuenteMSPS: number
    },
    actividad: {
        actividad_ID: number,
        codigo: number,
        metaODS: string
    },
    mga: {
        mgA_ID: number,
        codigo: number
    },
    pospre: {
        pospre_ID: number,
        codigo: number
    },
    apropiacionDisponible: number,
    aumento: number,
    disminucion: number,
    compromisos: number,
    apropiacionDefinitiva: number,
    giros: number,
    subAumento: number,
    subDisminucion: number,
    iva: number,
    arl: number,
}

export interface getDataTemporalModifiedI {
    proyecto: getInfoToCreateReqDataI,
    aniosVigencia:number[],
    requerimiento: {
        project_ID: number,
        req_ID: number,
        requerimiento_ID: number,
        solicitud_Mod_ID: number,
        numeroRequerimiento: number,
        numeroRequerimientoModified: boolean,
        numeroModificacion: number,
        dependenciaDestino: {
            dependencia_ID: number,
            codigo: string
            detalle: string
        },
        dependenciaDestinoModified: boolean,
        
        mesEstimadoInicioSeleccion: number,
        mesEstimadoInicioSeleccionModified: boolean,

        mesEstimadoPresentacion: number,
        mesEstimadoPresentacionModified: boolean,

        mesEstmadoInicioEjecucion: number,
        mesEstmadoInicioEjecucionModified: boolean,

        duracionDias: number,
        duracionDiasModified: boolean,

        duracionMes: number,
        duracionMesModified: boolean,

        modalidadSeleccion: {
            modalidad_Sel_ID: number,
            codigo: string
        },
        modalidadSeleccionModified: boolean,

        actuacion: {
            actuacion_ID: number,
            tipo: string
        },
        actuacionModified: boolean,

        numeroDeContrato: string,
        numeroDeContratoModified: boolean,

        anioContrato: number,
        anioContratoModified: boolean,

        tipoContrato: {
            tipoContrato_ID: number,
            nombre: string
        },
        tipoContratoModified: boolean,

        perfil: {
            perfil_ID: number,
            nombre_Perfil: string
        },
        perfilModified: boolean,

        honorarios: number,
        honorariosModified: boolean,

        cantidadDeContratos: number,
        cantidadDeContratosModified: boolean,

        descripcion: string,
        descripcionModified: boolean,

        version: number,
        estado: string,
    },
  
    cadenasPresupuestales: cadenasPresupuestalesModifiedI[],

    apropiacionInicial: {
        apropIni_ID: number,
        anioV0: number,
        valor0: number,
        anioV1: number,
        valor1: number,
        anioV2: number,
        valor2: number,
        valorTotal: number
    },
    codsUNSPSC: [
        {
            unspsc: {
                unspsC_ID: number,
                codigoUNSPSC: number,
                descripcion: string
            },
            unspscNew: boolean
        }
    ]
}

export interface cadenasPresupuestalesModifiedI {
    cadenaNueva: boolean,
    cadenaPresupuestalDto: {
        uuid: string,
        project_ID: number,
        requerimiento_ID: number,
        mes: number,
        anioVigRecursos: number,
        auxiliar: {
            auxiliar_ID: number,
            codigoAuxiliar: number
        },
        fuente: {
            fuente_ID: number,
            codigoFuente: number,
            descripcion: string,
            fuenteMSPS: number
        },
        actividad: {
            actividad_ID: number,
            codigo: number,
            metaODS: string
        },
        mga: {
            mgA_ID: number,
            codigo: number
        },
        pospre: {
            pospre_ID: number,
            codigo: number
        },
        apropiacionDisponible: number,
        iva: number,
        arl: number,
        aumento: number,
        aumentoModified: boolean,
        subAumento: number,

        disminucion: number,
        disminucionModified: boolean,
        subDisminucion: number,
        compromisos: number,
        apropiacionDefinitiva: number,
        giros: number,
    },
   

}