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
    area: string,
    concepto: string,
    observacion: string,
    revisado: boolean
}

export interface postReviewsI {
    modificacion_ID: number,
    revisiones: reviewsI[]
}
export interface reviewsI{
    revisado: boolean,
    concepto: string,
    observacion: string,
    area_ID: number
}

export interface putUpdateReviewsI {
    modificacion_ID: number,
    revisiones: [any]
}
export interface putGetReviewsI {
    idSolicitud: number,
    idProject: number,
    comentarios: string,
    accion: number
}
export interface deleteReviewsI {
    modificacion_ID: number,
    revisiones: any
}