import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { cadenaRPsI, dataRPsI, postRPsI, RPsI } from 'src/app/Models/ModelsPAA/Requeriment/RP/RP.interface';
import { ModificationRequestService } from 'src/app/Services/ServicesPAA/modificationRequest/modification-request.service';
import { RpService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/RP/rp.service';
import { AlertsComponent } from 'src/app/Templates/alerts/alerts.component';

@Component({
  selector: 'app-rp',
  templateUrl: './rp.component.html',
  styleUrls: ['./rp.component.scss']
})
export class RpComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  dataProjectID: string = '';
  idReq: string = '';
  idCDP: string = '';
  actividadesColumns: string[] = ['codigoActividad', 'pospre', 'mga', 'auxiliar', 'fuente', 'aproDisponible', 'valorDistribuidos'];
  dataRPs: any[] = [];
  RPs = {} as RPsI;
  formRP = {} as postRPsI;
  elementsRP = new Array();
  //Valores para guardar la informacion del proyecto para mostrar en la miga de pan
  codProject: number = 0;
  nomProject: string = '';
  //cadenasRP: Array<cadenaRPsI> = [];

  isLocked: boolean = false;
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceRP: RpService,
    private serviceModRequest: ModificationRequestService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('idPro') || '';
    this.idReq = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.idCDP = this.activeRoute.snapshot.paramMap.get('idCDP') || '';
    this.getRPs(+this.idReq, +this.idCDP);
    this.getModificationRequet(Number(this.dataProjectID));

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
    let cadenas = [] as cadenaRPsI[];
    
    cadenas.map((item: any) => {
      if (item.clasificacion_ID == clasificacionId) {
        item.valoresDistribuidos = value;
      }
    });
    cadenas.push(cadenaRPs);
    let RPs = {} as RPsI
    RPs['rP_ID'] = idRP;
    RPs['cadenas'] = cadenas;
    this.elementsRP.push(RPs);
  }

  getRPs(idReq: number, idCDP: number) {
    this.spinner.show();
    this.serviceRP.getRPs(idReq, idCDP).subscribe(
      res => {
        this.dataRPs = res.data;
        this.spinner.hide();
      })
  }
  postRPs(idCDP: number, formRPs: postRPsI) {
    this.spinner.show();
    this.serviceRP.postRPs(idCDP, formRPs).subscribe(
      res => {
        // console.log(res);
        if (res.status == 200) {
          this.openSnackBar('Se ha guardado correctamente', res.message, 'success');
          this.spinner.hide();
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
          this.spinner.hide();
        }
      } ,(err:any) => {
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
    this.formRP.rps = this.elementsRP;
    this.postRPs(+this.idCDP, this.formRP);
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
