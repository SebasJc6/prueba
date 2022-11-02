import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VigilantSessionsGuard } from './Services/Authentication/Guards/vigilant-sessions.guard';
import { SidenavListComponent } from './Templates/sidenav-list/sidenav-list.component';
import { DashboardComponent } from './Views/dashboard/dashboard.component';

import { HomeComponent } from './Views/home/home.component';
import { LoginComponent } from './Views/login/login.component';
import { AbstractComponent } from './Views/PAA/abstract/abstract.component';
import { AcquisitionsComponent } from './Views/PAA/acquisitions/acquisitions.component';
import { RequestTrayComponent } from './Views/PAA/request-tray/request-tray.component';
import { CDPComponent } from './Views/PAA/requirements/cdp/cdp.component';
import { ModificationRequestComponent } from './Views/PAA/requirements/modification-request/modification-request.component';
import { ModificationSummaryComponent } from './Views/PAA/requirements/modification-request/modification-summary/modification-summary.component';
import { PropertiesRequirementComponent } from './Views/PAA/requirements/properties-requirement/properties-requirement.component';




import { RequirementsComponent } from './Views/PAA/requirements/requirements.component';
import { TaskTrayComponent } from './Views/PAA/task-tray/task-tray.component';


const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  {
    path: 'WAPI', component: SidenavListComponent,
    canActivate: [VigilantSessionsGuard],
    children: [
      { path: 'Home', component: HomeComponent, canActivate: [VigilantSessionsGuard] },
      {
        path: 'PAA',
        children: [
          { path: 'Adquisiciones', component: AcquisitionsComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'BandejaDeTareas', component: TaskTrayComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'BandejaDeSolicitudes', component: RequestTrayComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'Requerimientos/:data', component: RequirementsComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'PropiedadesRequerimiento/:idPro/:idSol/:idReq/:type', component: PropertiesRequirementComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'Resumen/:data', component: AbstractComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'CDP/:idPro/:idReq', component: CDPComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'SolicitudModificacion/:idPro/:idSol', component: ModificationRequestComponent, canActivate: [VigilantSessionsGuard] },
          { path: 'ResumenModificacion/:idPro/:idSol', component: ModificationSummaryComponent, canActivate: [VigilantSessionsGuard] }
        ]
      }
    ]
  },
 



];

@NgModule({

  imports: [RouterModule.forRoot(routes)],

  exports:
    [
      RouterModule
    ]


})






export class AppRoutingModule { }
