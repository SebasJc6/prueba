
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