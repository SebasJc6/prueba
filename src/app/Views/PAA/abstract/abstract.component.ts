import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dataAbstractI, responsibleAbstractI } from 'src/app/Models/ModelsPAA/Abstract/abstract';
import { ProjectByIdI, responsableI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { AbstractService } from 'src/app/Services/ServicesPAA/Abstract/abstract.service';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';




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
  ) { }

  dataProjectID = '';

  abstractData = {} as dataAbstractI;
  responsibleAbstractData = {} as responsibleAbstractI;

  Modelo = 'Interpolacion';

  valor = 7791;


  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';
     //console.log(+this.dataProjectID)
    //  this.getProjectByID(+this.dataProjectID);

    this.getAbstract(this.dataProjectID);
  }

  getAbstract(projectId: string) {
    this.serviceAbsctract.getAbstract(projectId).subscribe(request => {
      this.abstractData = request.data;
      this.responsibleAbstractData = request.data.responsable;
    });
  }

  // getProjectByID(projectId : number){
  //   this.serviceRequeriment.getProjectById(projectId).subscribe((data)=> {
  //     this.viewProjectById = data.data;
  //     this.viewResponsable = this.viewProjectById.responsable;
  //     console.log(this.viewProjectById)
  //     console.log(this.viewResponsable)

  //   })
  // }

  regresar(){
    this.router.navigate(['/PAA/Adquisiciones'])
  }
}


