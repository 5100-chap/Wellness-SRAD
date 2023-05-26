import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../../login/login.component';
import { LockersComponent } from '../../lockers/lockers.component';
import { Error404Component } from '../../error404/error404.component';
import { AreaDeportivaComponent } from '../../area-deportiva/area-deportiva.component';
import { authGuard } from '../../guard/auth.guard';

const routesShared: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'lockers',
        component: LockersComponent,
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'error404',
        component: Error404Component,
    },
    {
        path: 'areaDeportiva',
        component: AreaDeportivaComponent,
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