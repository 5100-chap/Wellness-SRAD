import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import esLocale from '@fullcalendar/core/locales/es';
import { Eventos } from '../models/event.model';


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
    this.updateDayHeaderFormat();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateDayHeaderFormat();
  }

  updateDayHeaderFormat() {
    if (window.innerWidth < 768) {
      this.calendarOptions.dayHeaderFormat = { weekday: 'short' };
    } else {
      this.calendarOptions.dayHeaderFormat = { weekday: 'long' };
    }
  }


  calendarOptions: CalendarOptions = {
    timeZone: 'America/Mexico_City',
    locale: esLocale,
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
      right: 'prev,today,next',
    },
    themeSystem: 'bootstrap5',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
    },
    displayEventTime: false,
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
