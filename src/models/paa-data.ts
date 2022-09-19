


export interface Data
{
  name: string;
  position: number;
  weight: number;
  symbol: string;


  ///////////////////////////////////////////////////////////////
  ////////////////Plan Anual de Adquisiciones////////////////////
  ///////////////////////////////////////////////////////////////
  proyecto_ID:          number,
  entidadNombre:        string,  // Subsecretaria
  codigoProyecto:       number,  // Codigo del Proyecto
  nombre:               string,  // Nombre del Proyecto
  valorAsignado:        number,  // Valor Asignado
  valorTotal:           number,  // Valor Total
  estadoDesc:           string,  // En Ejecucion, Cerrado,
                                 // Aprobado, Anteproyecto
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////


  numeroModificacion:   number,
  planDD_ID:            number,
  estado_ID:            number,
  entidad_ID:           number,


  dependenciaOrigenID:  number,  // dependenciaOrigen de los Recursos ID
  codDependencia:       null,
  dependenciaOrigen:    string,  //
  reponsable:           null,    // Nombre del Responsable
  responsable_ID:       number,
  descripcion:          string,  // Telefono del Responsable
  telefono:             number,
  correo:               string,




  estado:               string,



  id:number;
	itemName: string;
	isCompleted:boolean;


  ///////////////////////////////////////////////////////////////
  ////////////////   Solicitud Mofificacion  ////////////////////
  ///////////////////////////////////////////////////////////////
  numrequired:              number,
  dependency:               number,
  description:              string,
  actividad:                number;
  pospre:                   number,
  auxiliar:                 number,
  mga:                      number,
  fuente:                   number,
  saldorequerimiento:       string,
  valorqueaumenta:          number,
  valorquedisminuye:        number,
  nuevosaldodeapripiacion:  number,

  accion:                   number,
  formato:                  string,
  fotocopia:                string,
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

}
