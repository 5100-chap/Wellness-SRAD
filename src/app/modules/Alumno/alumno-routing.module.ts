import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Alumno components
import { ListaAreasComponent } from '../../lista-areas/lista-areas.component';
import { ListaReservasComponent } from '../../lista-reservas/lista-reservas.component';
import { CalendarioComponent } from '../../calendario/calendario.component';
import { IdDigitalComponent } from '../../id-digital/id-digital.component';
import { GimnasioComponent } from '../../gimnasio/gimnasio.component';
import { TendenciasComponent } from '../../tendencias/tendencias.component';
import { CitasentrenadorComponent } from '../../citasentrenador/citasentrenador.component';
import { CitasnutriologoComponent } from '../../citasnutriologo/citasnutriologo.component';
import { HorarioAsesorComponent } from '../../horario-asesor/horario-asesor.component';
import { CodigoQrComponent } from '../../codigo-qr/codigo-qr.component';
import { EncuestaComponent } from '../../encuesta/encuesta.component';
import { AnunciosComponent } from '../../anuncios/anuncios.component';
import { LockersComponent } from 'src/app/lockers/lockers.component';
import { AreaDeportivaComponent } from '../../area-deportiva/area-deportiva.component';

import { authGuard } from '../../guard/auth.guard';

const routesAlumno: Routes = [
    {
        path: 'inicio',
        component: ListaAreasComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'areaDeportiva/:nombreArea',
        component: AreaDeportivaComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        }
    },
    {
        path: 'reservas',
        component: ListaReservasComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'calendario',
        component: CalendarioComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'idDigital',
        component: IdDigitalComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'gimnasio',
        component: GimnasioComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'tendencias',
        component: TendenciasComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'citas_entrenador',
        component: CitasentrenadorComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'citas_nutriologo',
        component: CitasnutriologoComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'horario-asesor',
        component: HorarioAsesorComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'codigo-qr',
        component: CodigoQrComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'encuesta',
        component: EncuestaComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'anuncios',
        component: AnunciosComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'entrenadores',
        component: CitasentrenadorComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'nutriologos',
        component: CitasnutriologoComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'horarioAsesor',
        component: HorarioAsesorComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
    {
        path: 'lockers',
        component: LockersComponent,
        canActivate: [authGuard(['Alumno'])],
        data: {
            allowedRoles: ['Alumno'],
        },
    },
];
@NgModule({
    imports: [RouterModule.forChild(routesAlumno)],
    exports: [RouterModule],
})
export class AlumnoRoutingModule { }
