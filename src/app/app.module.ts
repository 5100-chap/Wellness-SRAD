import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';


import { QRCodeModule } from 'angularx-qrcode';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ListaAreasComponent } from './lista-areas/lista-areas.component';
import { ListaReservasComponent } from './lista-reservas/lista-reservas.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IdDigitalComponent } from './id-digital/id-digital.component';
import { EsportsComponent } from './esports/esports.component';
import { CrossfitComponent } from './crossfit/crossfit.component';
import { CalendarComponent } from './calendar/calendar.component';


import { RouterModule, Routes } from '@angular/router';
import { GimnasioComponent } from './gimnasio/gimnasio.component';
import { DropdownBasicComponent } from './dropdown-basic/dropdown-basic.component';
import { ArenaComponent } from './arena/arena.component';
import { CitasentrenadorComponent } from './citasentrenador/citasentrenador.component';
import { CitasnutriologoComponent } from './citasnutriologo/citasnutriologo.component';
import { HorarioAsesorComponent } from './horario-asesor/horario-asesor.component';
import { CodigoQrComponent } from './codigo-qr/codigo-qr.component';
import { EncuestaComponent } from './encuesta/encuesta.component';




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
 
  },
  {
    path: 'esports',
    component: EsportsComponent
  },
  {
    path: 'crossfit',
    component: CrossfitComponent
  },
  {
    path: 'arena',
    component: ArenaComponent
  },
  {
    path:'citas_entrenador',
    component:CitasentrenadorComponent
  },
  {
    path:'citas_nutriologo',
    component:CitasnutriologoComponent
  },
  {
    path:'horario-asesor',
    component:HorarioAsesorComponent
  },
  {
    path:'codigo-qr',
    component:CodigoQrComponent
  },
  {
    path:'encuesta',
    component:EncuestaComponent
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
    CalendarComponent,
    ArenaComponent,
    CitasentrenadorComponent,
    CitasnutriologoComponent,
    HorarioAsesorComponent,
    CodigoQrComponent,
    EncuestaComponent

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
  bootstrap: [AppComponent],
})
export class AppModule {}
