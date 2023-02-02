import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';


// angular material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

//Componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Views/home/home.component';
import { HeaderComponent } from './Templates/header/header.component';
import { FooterComponent } from './Templates/footer/footer.component';
import { AbstractComponent } from './Views/PAA/abstract/abstract.component';
import { AcquisitionsComponent } from './Views/PAA/acquisitions/acquisitions.component';
import { RequirementsComponent } from './Views/PAA/requirements/requirements.component';
import { NavBarComponent } from './Templates/nav-bar/nav-bar.component';
import { SidenavListComponent } from './Templates/sidenav-list/sidenav-list.component';
import { DashboardComponent } from './Views/dashboard/dashboard.component';
import { SearchComponent } from './Templates/search/search.component';
import { PropertiesRequirementComponent } from './Views/PAA/requirements/properties-requirement/properties-requirement.component';
import { AddrequirementsComponent } from './Views/PAA/requirements/modification-request/add-requeriments/add-requeriments.component';
import { CounterpartComponent } from './Views/PAA/requirements/modification-request/counterpart/counterpart.component';
import { ModificationSummaryComponent } from './Views/PAA/requirements/modification-request/modification-summary/modification-summary.component';
import { ModificationRequestComponent } from './Views/PAA/requirements/modification-request/modification-request.component';
import { TaskTrayComponent } from './Views/PAA/task-tray/task-tray.component';
import { RequestTrayComponent } from './Views/PAA/request-tray/request-tray.component';
import { AlertsComponent } from './Templates/alerts/alerts.component';
import { AlertsPopUpComponent } from './Templates/alerts-pop-up/alerts-pop-up.component';
import { LoginComponent } from './Views/login/login.component';
import { SpinnerComponent } from './Templates/spinner/spinner.component';
import { CDPComponent } from './Views/PAA/requirements/cdp/cdp.component';
import { BudgetModificationComponent } from './Views/PAA/requirements/properties-requirement/budget-modification/budget-modification.component';
import { AuthInterceptorService } from './Services/Authentication/Interceptor/auth-interceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PopUpImportComponent } from './Views/PAA/requirements/modification-request/pop-up-import/pop-up-import.component';
import { RpComponent } from './Views/PAA/requirements/cdp/rp/rp.component';
import { StockOrdersComponent } from './Views/PAA/requirements/stock-orders/stock-orders.component';
import { SpinnerInterceptorService } from './Services/Authentication/Interceptor/spinner-interceptor.service';
import { OrdersComponent } from './Views/PAA/requirements/stock-orders/orders/orders.component';
import { PageNotFoundComponent } from './Views/page-not-found/page-not-found.component';
import { ReportsComponent } from './Views/PAA/reports/reports.component';


const materialModules = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatTableModule,
  MatRadioModule,
  MatProgressBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatPaginatorModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatAutocompleteModule,
]



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AbstractComponent,
    AcquisitionsComponent,
    RequirementsComponent,
    NavBarComponent,
    SidenavListComponent,
    DashboardComponent,
    SearchComponent,
    PropertiesRequirementComponent,
    AddrequirementsComponent,
    CounterpartComponent,
    ModificationSummaryComponent,
    ModificationRequestComponent,
    TaskTrayComponent,
    RequestTrayComponent,
    AlertsComponent,
    AlertsPopUpComponent,
    LoginComponent,
    SpinnerComponent,
    CDPComponent,
    BudgetModificationComponent,
    PopUpImportComponent,
    RpComponent,
    StockOrdersComponent,
    OrdersComponent,
    PageNotFoundComponent,
    ReportsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    // angular material
    materialModules,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),

  ],
  providers:
    [
      AlertsPopUpComponent,
      PopUpImportComponent,
      CurrencyPipe,
      { provide: LocationStrategy, useClass: HashLocationStrategy},
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
      {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true},
      DatePipe
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})



export class AppModule { }
