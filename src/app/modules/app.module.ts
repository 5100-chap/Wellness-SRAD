import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { QRCodeModule } from 'angularx-qrcode';
import { RouterModule, Routes } from '@angular/router';


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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
