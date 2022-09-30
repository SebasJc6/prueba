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
    nombreProyecto: string,
    numeroModificacion: number,
    dependenciaOrigen: string
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
export interface getAllFuentesI{
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
export interface getAllActivitiesI{
    status: number,
    message: string,
    title: string,
    data: getAllActivitiesDataI
}
export interface getAllActivitiesDataI {
    actividad_ID: number,
    codigoAct: string,
    metaODS: string,
}

//MGA
export interface getAllMGAI{
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
export interface getAllPOSPREI{
    status: number,
    message: string,
    title: string,
    data: getAllPOSPREDataI
}
export interface getAllPOSPREDataI {
    pospre_ID: number,
    codPOSPRE: string,
    descripcionPOSPRE: string,
}

//UNSPSC
export interface getAllUNSPSCI{
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
export interface getAllReviewsAreaI{
    status: number,
    message: string,
    title: string,
    data: getAllReviewsAreaDataI
}
export interface getAllReviewsAreaDataI {
    area_ID: number,
    nombre: string,
}

//datatables
export interface dataSourceClasificacionesI{
    MGA:getAllMGADataI,
    POSPRE:getAllPOSPREDataI,
    actividad:getAllActivitiesDataI,
    auxiliar:getAllAuxiliarDataI,
    dataFuente:getAllFuentesDataI,
    mes: string,
    vigenciaRecu:number
}
export interface dataSourceRevisionesI{
    revisionID:number;
    fecha:string,
    usuario:string,
    area:getAllReviewsAreaDataI,
    concepto:string,
    observacion:string,
    revision:boolean
}



//varify
export interface budgetStringsI{
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