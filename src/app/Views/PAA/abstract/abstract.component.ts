import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { dataAbstractI, responsibleAbstractI } from 'src/app/Models/ModelsPAA/Abstract/abstract';
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
    private activeRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,) { }

  dataProjectID = '';

  abstractData = {} as dataAbstractI;
  responsibleAbstractData = {} as responsibleAbstractI;

  Modelo = 'Interpolacion';

  valor = 7791;


  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';

    this.getAbstract(this.dataProjectID);
  }

  getAbstract(projectId: string) {
    this.spinner.show();
    this.serviceAbsctract.getAbstract(projectId).subscribe(request => {
      this.abstractData = request.data;
      this.responsibleAbstractData = request.data.responsable;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  regresar(){
    this.router.navigate(['/WAPI/PAA/Adquisiciones'])
  }
}


