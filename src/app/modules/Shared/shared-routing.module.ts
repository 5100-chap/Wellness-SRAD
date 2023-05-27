import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../../login/login.component';
import { Error404Component } from '../../error404/error404.component';
import { authGuard } from '../../guard/auth.guard';

const routesShared: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: Error404Component,
        canActivate: [
            authGuard(['Alumno', 'Director', 'Administrador', 'Instructor']),
        ],
        data: {
            allowedRoles: ['Alumno', 'Director', 'Administrador', 'Instructor'],
        },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routesShared)],
    exports: [RouterModule],
})
export class SharedModuleRoutingModule { }