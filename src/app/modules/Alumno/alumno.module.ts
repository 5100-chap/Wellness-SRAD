import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

//Alumno components
import { ListaAreasComponent } from '../../lista-areas/lista-areas.component';
import { ListaReservasComponent } from '../../lista-reservas/lista-reservas.component';
import { CalendarioComponent } from '../../calendario/calendario.component';
import { IdDigitalComponent } from '../../id-digital/id-digital.component';
import { GimnasioComponent } from '../../gimnasio/gimnasio.component';
import { TendenciasComponent } from '../../tendencias/tendencias.component';
import { EsportsComponent } from '../../esports/esports.component';
import { CrossfitComponent } from '../../crossfit/crossfit.component';
import { ArenaComponent } from '../../arena/arena.component';
import { CitasentrenadorComponent } from '../../citasentrenador/citasentrenador.component';
import { CitasnutriologoComponent } from '../../citasnutriologo/citasnutriologo.component';
import { HorarioAsesorComponent } from '../../horario-asesor/horario-asesor.component';
import { CodigoQrComponent } from '../../codigo-qr/codigo-qr.component';
import { EncuestaComponent } from '../../encuesta/encuesta.component';
import { AnunciosComponent } from '../../anuncios/anuncios.component';

import { AlumnoRoutingModule } from './alumno-routing.module';

@NgModule({
    declarations: [
        ListaAreasComponent,
        ListaReservasComponent,
        CalendarioComponent,
        IdDigitalComponent,
        GimnasioComponent,
        TendenciasComponent,
        EsportsComponent,
        CrossfitComponent,
        ArenaComponent,
        CitasentrenadorComponent,
        CitasnutriologoComponent,
        HorarioAsesorComponent,
        CodigoQrComponent,
        EncuestaComponent,
        AnunciosComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        QRCodeModule,
        AlumnoRoutingModule,
        NgbModule
    ]
})
export class AlumnoModule { }