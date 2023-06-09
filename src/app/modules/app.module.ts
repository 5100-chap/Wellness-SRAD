import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { QRCodeModule } from 'angularx-qrcode';
import { RouterModule, Routes } from '@angular/router';

import {LOCALE_ID } from '@angular/core';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs, 'ES'); //Esto no es un import, pero va justo despues de ellos!


// Imported Modules
import { AdminModule } from './Admin/admin.module';
import { AlumnoModule } from './Alumno/alumno.module';
import { SharedModule } from './Shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

// App components
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DropdownBasicComponent } from '../dropdown-basic/dropdown-basic.component';

import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DropdownBasicComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    QRCodeModule,
    NgbModule,
    AppRoutingModule,
    AdminModule,
    AlumnoModule,
    SharedModule,
    FullCalendarModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'es' } ],


  bootstrap: [AppComponent]
})
export class AppModule { }
