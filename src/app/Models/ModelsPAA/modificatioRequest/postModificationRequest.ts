//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// ESTE MODELO SIRVE PARA TRABAJAS LOS 2 ENPOINTS POST
//                  SolicitudMod/Guardar'
//                  SolicitudMod/Enviar'
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//


export interface postModRequest {
  idProyecto:     number,
  observacion:    string,
  datos:          datos[],
  contrapartidas: contrapartidas[],
}

export interface datos{
  modificacion_ID:number,
  accion:number,
  modificacion:   modificacion[],
}

export interface modificacion{
  proyecto:               proyecto,
  estado:                 estado,
  requerimiento:          requerimiento,
  clasificacionPres:      clasificacionPres,
  codsUNSPSC:             codsUNSPSC,
  apropiacionInicial:     apropiacionInicial,
}

export interface proyecto{
  proj_ID:    number,
  codProy:    number,
  numModif:   number,
  depOrigen:  string,
  totalReqs:  number
}

export interface estado{
  estado_ID:number,
  estado:string
}


//********************************************/
export interface requerimiento{
  req_ID:         number,
  numReq:         number,
  numModif:       number,
  mesEinicioSel:  number,
  mesEPres:       number,
  mesEinicioEjec: number,
  dur_Dias:       number,
  dur_Mes:        number,
  contratoNum:    string,
  honorarios:     number,
  cantContratos:  number,
  descripcion:    string,
  depDestino:     depDestino,
  modSel:         modSel,
  actuacion:      actuacion,
  tipoContrato:   tipoContrato,
  perfil:         perfil,
}
export interface depDestino{
  dep_ID:number,
  codigo:string,
}
export interface modSel{
  modSel_ID:number,
  codigo:string,
}
export interface actuacion{
  act_ID:number,
  tipo:string,
}
export interface tipoContrato{
  tipoCont_ID:number,
  nombre:string,
}
export interface perfil{
  perf_ID:number,
  nombre:string,
}
///+++++++++++++++++++++++++++++++++++++++++++///




//+++++++++++++++++++++++++++++++++++++++++++++//
export interface clasificacionPres{
  req_ID:       number,
  numModif:     number,
  mes:          number,
  vigRecursos:  number,
  valor:        number,
  compromiso:   number,
  aumento:      number,
  disminucion:  number,
  auxiliar:     auxiliar,
  fuente:       fuente,
  actividad:    actividad,
  mga:          mga,
  pospre:       pospre,
}

export interface auxiliar {
  aux_ID:       number,
  codigo:       string,
}
export interface fuente{
  fte_ID:         number,
  detalleFuente:  string,
  f_MSPS:         string
}
export  interface actividad{
  activ_ID:     number,
  codigo:       string,
  meta:         string,
}
export interface mga{
  mgA_ID:   number,
  codigo:   string,
}
export interface pospre{
  pospre_ID:    number,
  codigo:       string,
}
//+++++++++++++++++++++++++++++++++++++++++++++//


//+++++++++++++++++++++++++++++++++++++++++++++//
export interface codsUNSPSC{
  uns_ID:         number,
  codigo:         string,
  descripcion:    string,
}
export interface apropiacionInicial{
  apropIni_ID:  number,
  añoV0:        number,
  valor0:       number,
  añoV1:        number,
  valor1:       number,
  añoV2:        number,
  valor2:       number,
  valorTotal:   number
}
//+++++++++++++++++++++++++++++++++++++++++++++//




//+++++++++++++++++++++++++++++++++++++++++++++//
export interface contrapartidas{
  modificacion_ID:number,
  contrapartida:contrapartida,
}

export interface contrapartida{
  idFuenteProyecto:number,
  descripcion:string,
  valorAumenta:number,
  valorDisminuye:number,
}
//+++++++++++++++++++++++++++++++++++++++++++++//


