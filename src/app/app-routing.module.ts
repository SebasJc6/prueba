import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Views/dashboard/dashboard.component';

import { HomeComponent } from './Views/home/home.component';
import { AbstractComponent } from './Views/PAA/abstract/abstract.component';
import { AcquisitionsComponent } from './Views/PAA/acquisitions/acquisitions.component';
import { RequestTrayComponent } from './Views/PAA/request-tray/request-tray.component';
import { ModificationRequestComponent } from './Views/PAA/requirements/modification-request/modification-request.component';
import { ModificationSummaryComponent } from './Views/PAA/requirements/modification-request/modification-summary/modification-summary.component';
import { PropertiesRequirementComponent } from './Views/PAA/requirements/properties-requirement/properties-requirement.component';




import { RequirementsComponent } from './Views/PAA/requirements/requirements.component';
import { TaskTrayComponent } from './Views/PAA/task-tray/task-tray.component';


const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  {
    path: 'PAA',
    children: [
      { path: '', redirectTo: '/Adquisiciones', pathMatch: 'full' },
      { path: 'Adquisiciones', component: AcquisitionsComponent },
      { path: 'BandejaDeTareas', component: TaskTrayComponent },
      { path: 'BandejaDeSolicitudes', component: RequestTrayComponent },
      { path: 'Requerimientos/:data', component: RequirementsComponent },
      { path: 'PropiedadesRequerimiento/:idPro/:idReq', component: PropertiesRequirementComponent },
      { path: 'Resumen/:data', component: AbstractComponent },
      { path: 'SolicitudModificacion/:data', component: ModificationRequestComponent },
      { path: 'ResumenModificacion',   component: ModificationSummaryComponent }
    ]
  }



];

@NgModule({

  imports: [RouterModule.forRoot(routes)],

  exports:
    [
      RouterModule
    ]


})






export class AppRoutingModule { }
