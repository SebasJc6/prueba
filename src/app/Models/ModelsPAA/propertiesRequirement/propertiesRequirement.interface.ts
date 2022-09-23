//info basica de proyecto
export interface getInfoToCreateReqI {
    status: number,
    message: string,
    title: string,
    data: getInfoToCreateReqDataI
}
export interface getInfoToCreateReqDataI{
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
export interface getAllDependenciesDataI{
    dependencia_ID: number,
    codigo: string,
    detalle: string,
    tipo: string
}
//modalidad se selccion
export interface getAllSelectionModeI{
    status: number,
    message: string,
    title: string,
    data: getAllSelectionModeDataI
}
export interface getAllSelectionModeDataI{
    modalidad_Sel_ID: number,
    codigo: string,
    caracteristicas: string
}
//actuacion contractual
export interface getAllContractualActionI{
    status: number,
    message: string,
    title: string,
    data: getAllContractualActionDataI
}
export interface getAllContractualActionDataI{
    actuacion_ID: number,
    tipo: string
}

