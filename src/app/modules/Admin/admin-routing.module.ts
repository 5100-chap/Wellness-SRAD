import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin components
import { InicioAdminComponent } from '../../inicio-admin/inicio-admin.component';
import { NuevaAreaComponent } from '../../nueva-area/nueva-area.component';
import { EditarAforoComponent } from '../../editar-aforo/editar-aforo.component';
import { CerrarEspaciosComponent } from '../../cerrar-espacios/cerrar-espacios.component';
import { CrearAnuncioComponent } from '../../crear-anuncio/crear-anuncio.component';
import { StatsAdminComponent } from '../../stats-admin/stats-admin.component';
import { StatsGymAdminComponent } from '../../stats-gym-admin/stats-gym-admin.component';
import { MonitorIngresosComponent } from '../../monitor-ingresos/monitor-ingresos.component';
import { ExportarDatosComponent } from '../../exportar-datos/exportar-datos.component';
import { MonitorReservasComponent } from '../../monitor-reservas/monitor-reservas.component';
import { authGuard } from '../../guard/auth.guard';

const routesAdmin: Routes = [
    {
        path: 'inicioAdmin',
        component: InicioAdminComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'crearArea',
        component: NuevaAreaComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'editarAforo/:nombreArea',
        component: EditarAforoComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'cerrarEspacios',
        component: CerrarEspaciosComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'crearAnuncio',
        component: CrearAnuncioComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'estadisticas/:nombreArea',
        component: StatsAdminComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'estadisticasGimnasio',
        component: StatsGymAdminComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'monitorIngresos',
        component: MonitorIngresosComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'exportarDatos',
        component: ExportarDatosComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
    {
        path: 'monitorReservas',
        component: MonitorReservasComponent,
        canActivate: [authGuard(['Director', 'Administrador', 'Instructor'])],
        data: {
            allowedRoles: ['Director', 'Administrador', 'Instructor'],
        },
    },
];


@NgModule({
    imports: [RouterModule.forChild(routesAdmin)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }