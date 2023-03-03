import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { abstractDataI, abstractDataYearI, responsibleAbstractI } from 'src/app/Models/ModelsPAA/Abstract/abstract';
import { AbstractService } from 'src/app/Services/ServicesPAA/Abstract/abstract.service';


@Component({
  selector: 'app-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.scss']
})
export class AbstractComponent implements OnInit {

  constructor(
    public serviceAbsctract: AbstractService,
    public router: Router,
    private activeRoute: ActivatedRoute,) { }

  dataProjectID = '';

  abstractData = {} as abstractDataI;
  abstractDataInfoYear = {} as abstractDataYearI;
  responsibleAbstractData = {} as responsibleAbstractI;
  year!: number;
  arrayYears: number[] = [];

  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';

    this.getAbstract(this.dataProjectID);
  }


  getAbstract(projectId: string) {
    this.serviceAbsctract.getAbstract(projectId).subscribe(request => {
      this.year = request.data.anios[0];
      this.abstractData = request.data;
      this.responsibleAbstractData = request.data.responsable;
      this.arrayYears = request.data.anios;

      this.getAbstractYear();
    }, error => {
    });
  }


  //Obtener la informacion al cargar un año
  getAbstractYear() {
    if (this.arrayYears.length > 0) {
      this.serviceAbsctract.getAbstractYear(Number(this.dataProjectID), this.year).subscribe(res => {
        this.abstractDataInfoYear = res.data;
      });
    } else {
      this.abstractDataInfoYear = {
        apropiacionDefinitiva: 0,
        apropiacionInicial: 0,
        ejecucionAcumulada: 0,
        ejecucionApropPCT: 0,
        ejecucionGiroPCT: 0,
        ejecucionGirosPCT: 0,
        giroAcumulado: 0,
        girosReserva: 0,
        porEjecutar: 0,
        reservaConstituida: 0
      }
    }
  }

  regresar(){
    this.router.navigate(['/WAPI/PAA/Adquisiciones'])
  }
}


