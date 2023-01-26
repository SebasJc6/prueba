export interface getAllInitialApropriationI{
    status  : number;
    message : string;
    title   : string;
    data    : DataI;
}
export interface DataI{
    valorApropiacion_Incial : number;
    anio_Vigencia        : number;
    valorApropiacionAnio : number;
    valorApropiacion_Final  : number;
}