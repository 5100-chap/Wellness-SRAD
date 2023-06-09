import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';

@NgModule({
    declarations: [
        InicioAdminComponent,
        NuevaAreaComponent,
        EditarAforoComponent,
        CerrarEspaciosComponent,
        CrearAnuncioComponent,
        StatsAdminComponent,
        StatsGymAdminComponent,
        MonitorIngresosComponent,
        ExportarDatosComponent,
        MonitorReservasComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgbModule,
        SharedModule
    ]
})
export class AdminModule { }
