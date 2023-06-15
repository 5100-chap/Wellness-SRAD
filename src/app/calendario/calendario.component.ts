import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import esLocale from '@fullcalendar/core/locales/es';
import { Eventos } from '../models/event.model';
import { Anuncio } from '../models/anuncio';
import { ReservasAlumno } from '../models/reservas-alumno.model';
import { ReservaAsesorAlumno } from '../models/reserva-asesor-alumno';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit {
  public event: Event[];
  public events: any[];
  public options: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getTodasReservasAlumno();
  }

  calendarOptions: CalendarOptions = {
    timeZone: 'America/Mexico_City',
    locale: esLocale,
    initialView: 'dayGridMonth',
    firstDay: 0,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: true,
      meridiem: 'short',
    },
    nowIndicator: true,
    plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,today,next dayGridMonth',
    },
    themeSystem: 'bootstrap5',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
    },
    displayEventTime: false,
    dayHeaderFormat: {
      weekday: 'long',
    },
    buttonText: {
      prev: '<',
      next: '>',
    },
  };

  getTodasReservasAlumno() {
    const usuario = this.authService.currentUserValue['username'];
    this.apiService.getEventos(usuario).subscribe((data: Eventos[]) => {
      this.events = data;
    });

    (error) => {
      console.error('Error fetching all reservas from alumno --> ', error);
    };
  }
}
