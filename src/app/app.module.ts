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
import { authGuard } from './auth.guard';


const router: Routes = [
  {
    path: 'inicio',
    component: ListaAreasComponent,
        canActivate: [authGuard(['Alumno'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'reservas',
    component: ListaReservasComponent,
        canActivate: [authGuard(['Alumno'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'calendario',
    component: CalendarioComponent,
        canActivate: [authGuard(['Alumno'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'idDigital',
    component: IdDigitalComponent,
        canActivate: [authGuard(['Alumno'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Alumno']
    }
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
    component: GimnasioComponent,
        canActivate: [authGuard(['Alumno'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'tendencias',
    component: TendenciasComponent,
        canActivate: [authGuard(['Alumno'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Alumno']
    }
  },
  {
    path: 'inicioAdmin',
    component: InicioAdminComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'nuevaArea',
    component: NuevaAreaComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
  },
  {
    path: 'editarAforo',
    component: EditarAforoComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])], // only allow 'admin' and 'user' roles
    data: {
      allowedRoles: ['Director', 'Administrador', 'Instructor']
    }
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
    LoginComponent,
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