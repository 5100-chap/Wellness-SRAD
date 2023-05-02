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


import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GimnasioComponent } from './gimnasio/gimnasio.component';
import { DropdownBasicComponent } from './dropdown-basic/dropdown-basic.component';
import { TendenciasComponent } from './tendencias/tendencias.component';
import { InicioAdminComponent } from './inicio-admin/inicio-admin.component';
import { NuevaAreaComponent } from './nueva-area/nueva-area.component';
import { EditarAforoComponent } from './editar-aforo/editar-aforo.component';
import { LockersComponent } from './lockers/lockers.component';
import { CerrarEspaciosComponent } from './cerrar-espacios/cerrar-espacios.component';
import { CrearAnuncioComponent } from './crear-anuncio/crear-anuncio.component';
import { StatsAdminComponent } from './stats-admin/stats-admin.component';




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
    path: 'lockers',
    component: LockersComponent
  },
  {
    path: 'gimnasio',
    component: GimnasioComponent
  },
  {
    path: 'tendencias',
    component: TendenciasComponent
 
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full' 
  },
  {
    path: 'inicioAdmin',
    component: InicioAdminComponent
 
  },
  {
    path: 'crearArea',
    component: NuevaAreaComponent
  },
  {
    path: 'editarAforo',
    component: EditarAforoComponent
  },
  {
    path: 'cerrarEspacios',
    component: CerrarEspaciosComponent

  },
  {
    path: 'crearAnuncio',
    component: CrearAnuncioComponent

  },
  {
    path: 'estadisticas',
    component: StatsAdminComponent

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
    TendenciasComponent,
    InicioAdminComponent,
    NuevaAreaComponent,
    EditarAforoComponent,
    LockersComponent,
    CerrarEspaciosComponent,
    CrearAnuncioComponent,
    StatsAdminComponent,
    
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
