
export interface getFilesI {
    status: number,
    message: string,
    title: string,
    data: getAllFilesI

}
export interface getAllFilesI {
    blobName: string,
    fileName: string
}

export interface postFileI{
    tags:tagsI,
    archivos:[fileDataI]
}
export interface tagsI{
    idProject: number,
    idSol: number
}
export interface fileDataI{
    fileName: string,
    fileAsBase64: string
}