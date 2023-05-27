import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleRoutingModule } from './shared-routing.module';


// Shared components
import { LoginComponent } from '../../login/login.component';
import { Error404Component } from '../../error404/error404.component';
import { ImageUploadComponent } from 'src/app/image-upload/image-upload.component';

@NgModule({
    declarations: [
        LoginComponent,
        Error404Component,
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
        Error404Component,
        ImageUploadComponent
    ]
})
export class SharedModule { }
