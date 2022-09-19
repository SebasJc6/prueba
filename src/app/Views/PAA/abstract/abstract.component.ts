import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectByIdI, responsableI } from 'src/app/Models/ModelsPAA/Project/Project.interface';
import { ProjectService } from 'src/app/Services/ServicesPAA/Project/project.service';




@Component({
  selector: 'app-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.scss']
})
export class AbstractComponent implements OnInit {
  dataProjectID = '';
  viewProjectById = {} as ProjectByIdI;
  viewResponsable = {} as responsableI;

  constructor(
    public serviceRequeriment: ProjectService,
    public router: Router,
    private activeRoute: ActivatedRoute,
  ) { }



  Modelo = 'Interpolacion';

  valor = 7791;


  ngOnInit(): void {
    this.dataProjectID = this.activeRoute.snapshot.paramMap.get('data') || '';
     //console.log(+this.dataProjectID)
     this.getProjectByID(+this.dataProjectID);
  }


  getProjectByID(projectId : number){
    this.serviceRequeriment.getProjectById(projectId).subscribe((data)=> {
      this.viewProjectById = data.data;
      this.viewResponsable = this.viewProjectById.responsable;
      console.log(this.viewProjectById)
      console.log(this.viewResponsable)

    })
  }

  regresar(){
    this.router.navigate(['/PAA/Adquisiciones'])
  }
}


