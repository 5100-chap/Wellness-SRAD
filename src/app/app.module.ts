import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
import { StatsGymAdminComponent } from './stats-gym-admin/stats-gym-admin.component';
import { MonitorIngresosComponent } from './monitor-ingresos/monitor-ingresos.component';
import { ExportarDatosComponent } from './exportar-datos/exportar-datos.component';
import { AnunciosComponent } from './anuncios/anuncios.component';
import { CitasentrenadorComponent } from './citasentrenador/citasentrenador.component';
import { CitasnutriologoComponent } from './citasnutriologo/citasnutriologo.component';
import { HorarioAsesorComponent } from './horario-asesor/horario-asesor.component';
import { ArenaComponent } from './arena/arena.component';
import { CodigoQrComponent } from './codigo-qr/codigo-qr.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { CrossfitComponent } from './crossfit/crossfit.component';
import { EsportsComponent } from './esports/esports.component';
import { authGuard } from './auth.guard';
import { Error404Component } from './error404/error404.component';
import { AreaDeportivaComponent } from './area-deportiva/area-deportiva.component';


const router: Routes = [
  {
    path: 'inicio',
    component: ListaAreasComponent,
        canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'reservas',
    component: ListaReservasComponent,
        canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'calendario',
    component: CalendarioComponent,
        canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'idDigital',
    component: IdDigitalComponent,
        canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
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
    component: GimnasioComponent,
        canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'tendencias',
    component: TendenciasComponent,
        canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full' 
  },
  {
    path: 'inicioAdmin',
    component: InicioAdminComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'crearArea',
    component: NuevaAreaComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'editarAforo',
    component: EditarAforoComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'cerrarEspacios',
    component: CerrarEspaciosComponent,
    canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }

  },
  {
    path: 'crearAnuncio',
    component: CrearAnuncioComponent,
    canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }

  },
  {
    path: 'estadisticas',
    component: StatsAdminComponent,
    canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'esports',
    component: EsportsComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'crossfit',
    component: CrossfitComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'arena',
    component: ArenaComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path:'citas_entrenador',
    component:CitasentrenadorComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path:'citas_nutriologo',
    component:CitasnutriologoComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path:'horario-asesor',
    component:HorarioAsesorComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path:'codigo-qr',
    component:CodigoQrComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path:'encuesta',
    component:EncuestaComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'estadisticasGimnasio',
    component: StatsGymAdminComponent,
    canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'monitorIngresos',
    component: MonitorIngresosComponent,
    canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'exportarDatos',
    component: ExportarDatosComponent,
    canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], 
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'anuncios',
    component: AnunciosComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'entrenadores',
    component: CitasentrenadorComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'nutriologos',
    component: CitasnutriologoComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'horarioAsesor',
    component: HorarioAsesorComponent,
    canActivate: [authGuard(['Alumno'])], 
    data: {
      allowedRoles: ['Alumno']
    }

  }, 
  {
    path: 'error404',
    component: Error404Component
    
  },
  {
    path: 'areaDeportiva',
    component: AreaDeportivaComponent

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
    StatsGymAdminComponent,
    MonitorIngresosComponent,
    ExportarDatosComponent,
    AnunciosComponent,
    CitasentrenadorComponent,
    CitasnutriologoComponent,
    HorarioAsesorComponent,
    ArenaComponent,
    CitasentrenadorComponent,
    CitasnutriologoComponent,
    HorarioAsesorComponent,
    CodigoQrComponent,
    EncuestaComponent,
    CrossfitComponent,
    EsportsComponent,
    LoginComponent,
    Error404Component,
    AreaDeportivaComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    NoopAnimationsModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(router),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}