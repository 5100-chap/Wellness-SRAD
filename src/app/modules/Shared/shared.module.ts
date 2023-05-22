import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleRoutingModule } from './shared-routing.module';


// Shared components
import { LoginComponent } from '../../login/login.component';
import { LockersComponent } from '../../lockers/lockers.component';
import { Error404Component } from '../../error404/error404.component';
import { AreaDeportivaComponent } from '../../area-deportiva/area-deportiva.component';
import { ImageUploadComponent } from 'src/app/image-upload/image-upload.component';

@NgModule({
    declarations: [
        LoginComponent,
        LockersComponent,
        Error404Component,
        AreaDeportivaComponent,
        ImageUploadComponent
    ],
    imports: [
        CommonModule,
        SharedModuleRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        LoginComponent,
        LockersComponent,
        Error404Component,
        AreaDeportivaComponent
    ]
})
export class SharedModule { }
