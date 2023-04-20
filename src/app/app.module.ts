import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';

import { QRCodeModule } from 'angularx-qrcode';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ListaAreasComponent } from './lista-areas/lista-areas.component';
import { ListaReservasComponent } from './lista-reservas/lista-reservas.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IdDigitalComponent } from './id-digital/id-digital.component';
import { EsportsComponent } from './esports/esports.component';
import { CrossfitComponent } from './crossfit/crossfit.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CalendarComponent } from './calendar/calendar.component';


import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GimnasioComponent } from './gimnasio/gimnasio.component';
import { DropdownBasicComponent } from './dropdown-basic/dropdown-basic.component';




const router: Routes = [
  {
    path: 'inicio',
    component: ListaAreasComponent
  },
  {
    path: 'reservas',
    component: ListaReservasComponent
  },
  {
    path: 'calendario',
    component: CalendarioComponent
  },
  {
    path: 'idDigital',
    component: IdDigitalComponent
  },
  {
    path: 'login',
    component: LoginComponent

  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full' 
  },
  {
    path: 'gimnasio',
    component: GimnasioComponent
 
  }

];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ListaAreasComponent,
    ListaReservasComponent,
    CalendarioComponent,
    IdDigitalComponent,
    GimnasioComponent,
    DropdownBasicComponent,
    EsportsComponent,
    CrossfitComponent,
    HeaderComponent,
    FooterComponent,
    CalendarComponent

  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    QRCodeModule,
    RouterModule.forRoot(router),    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
