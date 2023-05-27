import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { cadenaRPsI, dataRPsI, postRPsI, RPsI } from 'src/app/Models/ModelsPAA/Requeriment/RP/RP.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { PropertiesRequirementService } from 'src/app/Services/ServicesPAA/propertiesRequirement/properties-requirement.service';
import { RpService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/RP/rp.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-rp',
  templateUrl: './rp.component.html',
  styleUrls: ['./rp.component.scss']
})
export class RpComponent implements OnInit {
  dataRequirementNum: number = 0;

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  dataProjectID: string = '';
  idReq: string = '';
  idCDP: string = '';
  idRP: number = 0;
  listcadenas = [] as cadenaRPsI[];
  cadenas = [] as cadenaRPsI[];
  actividadesColumns: string[] = ['codigoActividad', 'pospre', 'mga', 'auxiliar', 'fuente', 'aproDisponible', 'valorDistribuidos'];
  dataRPs: any[] = [];
  RPs = {} as RPsI;
  formRP = {} as postRPsI;
  elementsRP = new Array();
  //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
  codProject: number = 0;
  nomProject: string = '';
  //cadenasRP: Array<cadenaRPsI> = [];

  //Objeto con la informacion de acceso del Usuario
  AccessUser: string = '';

  isLocked: boolean = false;
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceRP: RpService,
    private serviceModRequest: ModificationRequestService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog, private authService: AuthenticationService,
    private reqServices: PropertiesRequirementService
  ) { }

  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.idReq = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.idCDP = this.activeRoute.snapshot.paramMap.get('idCDP') || '';
    this.getRPs(+this.idReq, +this.idCDP);
    this.getModificationRequet(Number(this.dataProjectID));
    this.getDataRequirement();
    this.AccessUser = this.authService.getRolUser();
  }
  getDataRequirement() {
    this.reqServices.getDataAprobad(+this.dataProjectID, +this.idReq).subscribe((data) => {
      this.dataRequirementNum = data.data.requerimiento.numeroRequerimiento;
    });
  }

  //Obtener la información del proyecto para mostrar en miga de pan
  getModificationRequet(projectId: number) {
    this.serviceModRequest.getModificationRequest(projectId).subscribe((data) => {
      this.codProject = data.data.proyecto_COD;
      this.nomProject = data.data.nombreProyecto;
    }, error => {
    });
  }
  valueChange(idRP: number, clasificacionId: number, value: number) {
    let cadenaRPs = {} as cadenaRPsI;
    cadenaRPs.clasificacion_ID = clasificacionId;
    cadenaRPs.valoresDistribuidos = value;

    this.cadenas.map((item: any) => {
      if (item.clasificacion_ID == clasificacionId) {
        item.valoresDistribuidos = value;
      }
    });

    //eliminar elementa si es el mismo id que se va agregar
    this.cadenas = this.cadenas.filter((item: any) => item.clasificacion_ID != clasificacionId);
    this.cadenas.push(cadenaRPs);
    this.idRP = idRP;
    this.listcadenas = this.cadenas;

  }

  getRPs(idReq: number, idCDP: number) {
    this.serviceRP.getRPs(idReq, idCDP).subscribe(
      res => {
        this.dataRPs = res.data;
      })
  }
  postRPs(idCDP: number, formRPs: postRPsI) {
    this.serviceRP.postRPs(idCDP, formRPs).subscribe(
      res => {
        if (res.status == 200) {
          this.openSnackBar('Se ha guardado correctamente', res.message, 'success');
          this.router.navigate(['/WAPI/PAA/CDP/' + this.dataProjectID, this.idReq]);
        }
        if (res.status == 404) {
          let Data: string[] = [];
          Data = Object.values(res.data);
          let errorMessages = '';
          Data.map(item => {
            errorMessages += item + '. ';
          });
          this.openSnackBar('Error', '', 'error', errorMessages);
        }
      }, (err: any) => {
        let Data: string[] = [];
        Data = Object.values(err.error.data);
        let errorMessages = '';
        Data.map(item => {
          errorMessages += item + '. ';
        });
        this.openSnackBar('Error', '', 'error', errorMessages);
      })
  }

  saveRPs() {
  
    if (this.listcadenas == undefined || this.listcadenas == null|| this.listcadenas.length==0) {
    } else {
      let RPs = {} as RPsI
      RPs['rP_ID'] = this.idRP;
      RPs['cadenas'] = this.listcadenas;
      this.elementsRP.push(RPs);
      this.formRP.rps = this.elementsRP;

      this.postRPs(+this.idCDP, this.formRP);
    }
  }
  cancel() {
    this.router.navigate(['/WAPI/PAA/CDP/' + this.dataProjectID, this.idReq]);
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
}
