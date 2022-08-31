import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './Views/home/home.component';
import { AbstractComponent } from './Views/PAA/abstract/abstract.component';
import { AcquisitionsComponent } from './Views/PAA/acquisitions/acquisitions.component';
import { ModificationRequestComponent } from './Views/PAA/modificationrequest/modificationrequest.component';

import { RequirementsComponent } from './Views/PAA/requirements/requirements.component';


const routes: Routes = [


  {path: '', redirectTo: '/Home', pathMatch:'full'},
  {path: 'Home',                  component:HomeComponent},
  {path: 'Adquisiciones',         component:AcquisitionsComponent},
  {path: 'Requerimientos/:data',  component:RequirementsComponent},
  {path: 'Resumen',               component:AbstractComponent},
  {path: 'SolicitudModificacion', component:ModificationRequestComponent}

];

@NgModule({

  imports: [RouterModule.forRoot(routes)],

  exports:
  [
    RouterModule
  ]


})



export class AppRoutingModule { }
