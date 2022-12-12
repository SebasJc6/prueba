import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { filterRequestTrayI, itemsRequestTrayI } from 'src/app/Models/ModelsPAA/request-tray/request-tray';
import { RequestTrayService } from 'src/app/Services/ServicesPAA/request-tray/request-tray.service';

@Component({
  selector: 'app-request-tray',
  templateUrl: './request-tray.component.html',
  styleUrls: ['./request-tray.component.scss']
})
export class RequestTrayComponent implements OnInit {

  constructor(private requestTrayService: RequestTrayService,
    public router: Router,) { }

  //INFORMACION PARA LA TABLA CLASIFICACION PRESUPUESTAL
  displayedColumns: string[] = ['solicitud', 'vigencia', 'fPresentacion', 'codigoP', 'proyecto', 'version', 'solicitante', 'estado', 'fAprobacion', 'accion'];
  dataSource: itemsRequestTrayI[] = [];

  //CAMPOS PARA EL FILTRO
  filterRequestTray = {} as filterRequestTrayI;

  filterForm = new FormGroup({
    NumeroSolicitud: new FormControl(),
    Vigencia: new FormControl(),
    FechaPresentacion: new FormControl(),
    CodigoProyecto: new FormControl(),
    NombreProyecto: new FormControl(''),
    Version: new FormControl(),
    Solicitante: new FormControl(''),
    Estado: new FormControl(''),
    FechaAprobacion_rechazo: new FormControl(),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });

  //Paginacion
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  numberPages: number = 0;
  numberPage: number = 0;
  dataProjectID: number = 0;

  estadoFilter: string[] = ['Todos', 'Aprobada', 'En Revisión', 'Rechazada', 'En Ajuste', 'En Creación']
  viewFilter: boolean = true;
  viewOrder = false;

  ngOnInit(): void {
    this.filterRequestTray.page = "1";
    this.filterRequestTray.take = 20;

    this.getRequestTray(this.filterRequestTray);
  }

  //Funcion para ontener la información del endpoint BandejaModificacion
  getRequestTray(filterRequestTray: filterRequestTrayI) {
    if (this.filterForm.value.Estado == 'Todos') {
      this.filterRequestTray.Estado =  ' ';
    }else{
    this.filterRequestTray.Estado = this.filterForm.get('Estado')?.value || '' ;
    }

    this.filterRequestTray.NumeroSolicitud = this.filterForm.value.NumeroSolicitud || '';
    this.filterRequestTray.Vigencia = this.filterForm.value.Vigencia || '';
    this.filterRequestTray.FechaPresentacion = this.filterForm.get('FechaPresentacion')?.value || '';
    this.filterRequestTray.CodigoProyecto = this.filterForm.get('CodigoProyecto')?.value || '';
    this.filterRequestTray.NombreProyecto = this.filterForm.get('NombreProyecto')?.value || '';
    this.filterRequestTray.Version = this.filterForm.value.Version || '';
    this.filterRequestTray.Solicitante = this.filterForm.get('Solicitante')?.value || '';
    this.filterRequestTray.FechaAprobacion_rechazo = this.filterForm.get('FechaAprobacion_rechazo')?.value || '';
    this.filterRequestTray.columna = this.filterForm.get('columna')?.value || '';
    this.filterRequestTray.ascending = this.filterForm.get('ascending')?.value || false;

    this.requestTrayService.getRequestTray(filterRequestTray).subscribe(request => {
      this.dataSource = request.data.items;
      this.numberPage = request.data.page;
      this.numberPages = request.data.pages;
      
      this.paginationForm.setValue({
        take: filterRequestTray.take,
        page: filterRequestTray.page
      });
      
    }, error => {
    });
  }

  modificatioRequest(ProjectId : number, requestId: number){
    this.dataProjectID = ProjectId;
    this.router.navigate(['/WAPI/PAA/SolicitudModificacion/' + this.dataProjectID + '/' + requestId ])
    sessionStorage.setItem('mgp', 'request-tray');
  }

  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterRequestTray.NumeroSolicitud = this.filterForm.value.NumeroSolicitud || '';
    this.filterRequestTray.Vigencia = this.filterForm.value.Vigencia || '';
    this.filterRequestTray.FechaPresentacion = this.filterForm.get('FechaPresentacion')?.value || '';
    this.filterRequestTray.CodigoProyecto = this.filterForm.get('CodigoProyecto')?.value || '';
    this.filterRequestTray.NombreProyecto = this.filterForm.get('NombreProyecto')?.value || '';
    this.filterRequestTray.Version = this.filterForm.value.Version || '';
    this.filterRequestTray.Solicitante = this.filterForm.get('Solicitante')?.value || '';
    this.filterRequestTray.FechaAprobacion_rechazo = this.filterForm.get('FechaAprobacion_rechazo')?.value || '';
    this.filterRequestTray.columna = this.filterForm.get('columna')?.value || '';
    this.filterRequestTray.ascending = this.filterForm.get('ascending')?.value || false;

    this.getRequestTray(this.filterRequestTray);

    this.closeFilter();
  }

  //Limpiar el Filtro
  clearFilter() {
    this.filterForm.reset();
    
    this.getRequestTray(this.filterRequestTray);
    this.closeFilter();
  }

    //PAGINACIÓN
    getPagination() {
      this.filterRequestTray.page = this.paginationForm.get('page')?.value;
      this.filterRequestTray.take = this.paginationForm.get('take')?.value;
      this.getRequestTray(this.filterRequestTray);
    }
  
    nextPage() {
      if (this.numberPage < this.numberPages) {
        this.numberPage++;
        this.filterRequestTray.page = this.numberPage.toString();
        this.getRequestTray(this.filterRequestTray);
      }
    }
  
    prevPage() {
      if (this.numberPage > 1) {
        this.numberPage--;
        this.filterRequestTray.page = this.numberPage.toString();
        this.getRequestTray(this.filterRequestTray);
      }
    }
  
    firstPage() {
      this.numberPage = 1;
      this.filterRequestTray.page = this.numberPage.toString();
      this.getRequestTray(this.filterRequestTray);
    }
  
    latestPage() {
      this.numberPage = this.numberPages;
      this.filterRequestTray.page = this.numberPage.toString();
      this.getRequestTray(this.filterRequestTray);
    }

    //Expresion regular para validar que solo se ingresen numeros en la paginación
  validateFormat(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }

}

var ProChartStorage = {
  getItem: function (key: any) {
    return localStorage.getItem(key);
  },
  setItem: function (key: any, value: any) {
    localStorage.setItem(key, value);
  },
  removeItem: function (key: any) {
    return localStorage.removeItem(key);
  },
  clear: function () {
    var keys = new Array();
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var key = localStorage.key(i);
      if (key?.indexOf("prochart") != -1 || key.indexOf("ProChart") != -1)
        keys.push(key);
    }
    for (var i = 0; i < keys.length; i++)
      localStorage.removeItem(keys[i]);
  }
}