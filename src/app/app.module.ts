import { NgModule } from '@angular/core';
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
    IdDigitalComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    QRCodeModule,
    RouterModule.forRoot(router),
    
    
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
