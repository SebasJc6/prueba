import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { cadenaRPsI, dataRPsI, postRPsI, RPsI } from 'src/app/Models/ModelsPAA/Requeriment/RP/RP.interface';
import { RpService } from 'src/app/Services/ServicesPAA/Requeriment/CDP/RP/rp.service';

@Component({
  selector: 'app-rp',
  templateUrl: './rp.component.html',
  styleUrls: ['./rp.component.scss']
})
export class RpComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  idReq: string = '';
  idCDP: string = '';
  actividadesColumns: string[] = ['codigoActividad', 'pospre', 'mga', 'auxiliar', 'fuente', 'aproDisponible', 'valorDistribuidos'];
  dataRPs: any[] = [];
  RPs = {} as RPsI;
  formRP = {} as postRPsI;
  elementsRP = new Array();
  //cadenasRP: Array<cadenaRPsI> = [];
  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    private serviceRP: RpService,
  ) { }

  ngOnInit(): void {
    this.idReq = this.activeRoute.snapshot.paramMap.get('idReq') || '';
    this.idCDP = this.activeRoute.snapshot.paramMap.get('idCDP') || '';
    this.getRPs(+this.idReq, +this.idCDP);
  }
  valueChange(idRP: number, clasificacionId: number, value: number) {
    let cadenaRPs = {} as cadenaRPsI;
    cadenaRPs.clasificacion_ID = clasificacionId;
    cadenaRPs.valoresDistribuidos = value;
    let cadenasRP = [] as Array<cadenaRPsI>;
    cadenasRP.push(cadenaRPs);
    this.RPs['rP_ID'] = idRP;
    this.RPs['cadenas'] = cadenasRP;
    this.elementsRP.push(this.RPs);

  }

  getRPs(idReq: number, idCDP: number) {
    this.serviceRP.getRPs(idReq, idCDP).subscribe(
      res => {
        console.log(res);
        this.dataRPs = res.data;
      })
  }
  postRPs(idCDP: number, formRPs: postRPsI) {
    this.serviceRP.postRPs(idCDP, formRPs).subscribe(
      res => {
        console.log(res);
      })
  }

  saveRPs() {
    this.formRP.rps = this.elementsRP;
    this.postRPs(+this.idCDP, this.formRP);
  }
}
