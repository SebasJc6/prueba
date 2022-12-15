import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filterCDPsI, itemsCDPsI } from 'src/app/Models/ModelsPAA/Requeriment/cdp';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { CDPService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/cdp.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-cdp',
  templateUrl: './cdp.component.html',
  styleUrls: ['./cdp.component.scss']
})
export class CDPComponent implements OnInit {

  constructor( private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceModRequest: ModificationRequestService,
    private serviceCdps: CDPService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService) { }

  displayedColumns: string[] = [
    'select',
    'Vigencia',
    'CDP',
    'FECHA CDP',
    'VALOR INICIAL',
    'VALOR ANULACIÓN',
    'FECHA ANULACIÓN',
    'VALOR FINAL',
    'CANTIDAD RP',
    'VALOR RP',
    'VALOR DISTRIBUIDO',
    'DIFERENCIA'
  ];

  //Propiedad con el Rol del Usuario
  AccessUser: string = '';

  //Información que se muestra en la tabla
  dataSource: itemsCDPsI[] = [];
  //Valor Inicial
  initialValue: number = 0;
  //Valor Anulación
  cancellationValue: number = 0;
  //Valor Final
  finalvalue: number = 0;
  //Valor RP
  valueRP: number = 0;
  //Valor Distribuido
  distributedValue: number = 0;
  //Diferencia
  diference: number = 0;

  dataProjectID: string = '';
  requerimentId: string = '';

  //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
  codProject: number = 0;
  nomProject: string = '';
  
  //FILTRO
  viewFilter: boolean = true;
  viewOrder: boolean = false;
  
  
  CDPsChecked: itemsCDPsI[] = [];
  selection = new SelectionModel<itemsCDPsI>(true, []);

  enableHabilit: boolean = false;
  
  
  //CAMPOS PARA EL FILTRO
  filterCDPs = {} as filterCDPsI;
  filterForm = new FormGroup({
    vigencia: new FormControl(),
    numeroCDP: new FormControl(),
    fechaCDP: new FormControl(),
    columna: new FormControl(''),
    ascending: new FormControl(false)
  });
  
  //Paginación
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });

  pageSizeOptions: number[] = [5, 10, 15, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  numberPages: number = 0;
  numberPage: number = 0;


  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.requerimentId = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.filterCDPs.page = "1";
    this.filterCDPs.take = 20;
    this.getModificationRequet(Number(this.dataProjectID));
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    
    //Obtener token para manejar los roles
    this.AccessUser = this.authService.getRolUser();
  }

  //Obtener la información del proyecto para mostrar en miga de pan
  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.nomProject = data.data.nombreProyecto;
    }, error => {
    });
  }


  getAllCDPsByRequerimentId(id_requeriment: number, filterForm: filterCDPsI) {
    this.filterCDPs.Vigencia = this.filterForm.value.vigencia || '';
    this.filterCDPs.CDP = this.filterForm.value.numeroCDP || '';
    this.filterCDPs.Fecha_CDP = this.filterForm.get('fechaCDP')?.value || '';
    this.filterCDPs.columna = this.filterForm.get('columna')?.value || '';
    this.filterCDPs.ascending = this.filterForm.get('ascending')?.value || false;

    this.serviceCdps.getCDPsByRequerimentId(id_requeriment, filterForm).subscribe(request => {
      if (request.hasItems) {
        this.dataSource = request.items;
        this.initialValue = request.calculados[0].valor;
        this.cancellationValue = request.calculados[1].valor;
        this.finalvalue = request.calculados[2].valor;
        this.valueRP = request.calculados[3].valor;
        this.distributedValue = request.calculados[4].valor;
        this.diference = request.calculados[5].valor;
        this.numberPages = request.pages;
        this.numberPage = request.page;
        this.paginationForm.setValue({
          take: filterForm.take,
          page: filterForm.page
        });
      } else {
        this.openSnackBar('Lo sentimos', `No hay CDPs asociados a este requerimiento.`, 'error');
      }
    }, error => {
    });
  }


  //Notificar CDPs
  notifyCDP() {
    this.serviceCdps.patchLockCDPs(Number(this.requerimentId)).subscribe(response => {
      if (response.status === 200) {
        if (response.data.hasBlockedAnyCDP) {
          this.openSnackBar('CDPs Notificados Exitosamente', `Los CDPs "${response.data.cdPs}" han sido bloqueados y notificados con éxito.`, 'success');
        } else {
          this.openSnackBar('Lo sentimos', `No fue posible notificar los CDPs.`, 'error');
        }
      } else {
        this.openSnackBar('ERROR', `Error " ${response.status} "`, 'error');
        console.log(response);
      }
    }, error => {
      this.openSnackBar('Lo sentimos', `Error interno en el sistema.`, 'error', `Comuniquese con el administrador del sistema.`);
    });
  }

  
  //Habilitar CDPs
  enableCDP(){
    this.CDPsChecked = this.selection.selected;
    
    if (this.CDPsChecked.length > 0) {
      let ARRAY_CDPS: number[] = [];
      this.CDPsChecked.forEach(element => {
        ARRAY_CDPS.push(element.cdP_ID);
      });

      let BODY_CDPS_ENABLE: any = {
        cdPs: ARRAY_CDPS
      }
      this.serviceCdps.patchEnableCDPs(Number(this.requerimentId), BODY_CDPS_ENABLE).subscribe(response => {
        console.log(response);
        
        if (response.status === 200) {
          if (response.data.hasEnableAnyCDP) {
            this.openSnackBar('CDPs Habilitados Exitosamente', `Los CDPs "${response.data.cdPs}" fueron habilitados con éxito.`, 'success');
          } else {
            this.openSnackBar('Lo sentimos', `No fue posible habilitar los CDPs.`, 'error');
          }
        } else {
          this.openSnackBar('ERROR', `Error " ${response.status} "`, 'error');
          console.log(response);
        }
      }, error => {

        if (error.error.status == 422) {
          let Data: string[] = [];
          let erorsMessages = '';
          if (error.error.data != null) {   
            Data = Object.values(error.error.data);
            Data.map(item => {
              erorsMessages += item + '. ';
            });
          }
          this.openSnackBar('Lo sentimos', error.error.message, 'error', erorsMessages);
        }
        console.log(error);
      });
    } else {
      this.openSnackBar('Lo sentimos', 'Seleccione al menos un CDP bloqueado para ser habilitado.', 'error');
    }
  }


  //FILTRO
  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    this.filterCDPs.Vigencia = this.filterForm.value.vigencia || '';
    this.filterCDPs.CDP = this.filterForm.value.numeroCDP || '';
    this.filterCDPs.Fecha_CDP = this.filterForm.get('fechaCDP')?.value || '';
    this.filterCDPs.columna = this.filterForm.get('columna')?.value || '';
    this.filterCDPs.ascending = this.filterForm.get('ascending')?.value || false;

    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    this.closeFilter();
  }

  //Limpiar el Filtro
  clearFilter() {
    this.filterForm.reset();
    
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    this.closeFilter();
  }


  //CHECKs
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;

    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSource.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: itemsCDPsI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }


  //PAGINACIÓN
  getPagination() {
    this.filterCDPs.page = this.paginationForm.get('page')?.value;
    this.filterCDPs.take = this.paginationForm.get('take')?.value;

    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterCDPs.page = this.numberPage.toString();
      this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    }
  }


  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterCDPs.page = this.numberPage.toString();
      this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
    }
  }


  firstPage() {
    this.numberPage = 1;
    this.filterCDPs.page = this.numberPage.toString();
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  latestPage() {
    this.numberPage = this.numberPages;
    this.filterCDPs.page = this.numberPage.toString();
    this.getAllCDPsByRequerimentId(Number(this.requerimentId), this.filterCDPs);
  }


  regresar() {
    this.router.navigate([`/WAPI/PAA/Requerimientos/${this.dataProjectID}`]);
  }


  //Metodo para llamar alertas
  openSnackBar(title: string, message: string, type: string, message2?: string) {
    this.snackBar.openFromComponent(AlertsComponent, {
      data: { title, message, message2, type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type],
    });
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
