import { getAllReviewsAreaDataI } from "../propertiesRequirement.interface"

export interface getAllReviewsI {
    status: number,
    message: string,
    title: string,
    data: getAllReviewsDataI
    calculados: any,
    total: number,
    page: number,
    pages: number
}
export interface getAllReviewsDataI {
    hasItems: true,
    items: getAllReviewsItemsI,
}
export interface getAllReviewsItemsI {
    solicitudRevID: number,
    fechaRevision: string,
    usuario: string,
    area: getAllReviewsAreaDataI,
    concepto: string,
    observacion: string,
    revisado: boolean
}

export interface postReviewsI {
    modificacion_ID: number,
    revisiones: reviewsI[]
}
export interface reviewsI{
    revision_ID: any,
    revisado: boolean,
    fecha: string,
    concepto: string,
    observacion: string,
    area_ID: number,
    usuario: string,
}

export interface putUpdateReviewsI {
    modificacion_ID: number,
    revisiones: revisionesI[]
}
export interface revisionesI{
    revision_ID: number,
    revisado: boolean,
}
export interface putGetReviewsI {
    idSolicitud: number,
    idProject: number,
    comentarios: string,
    accion: number
}
export interface deleteReviewsI {
    modificacion_ID: number,
    revisiones: number[]
}