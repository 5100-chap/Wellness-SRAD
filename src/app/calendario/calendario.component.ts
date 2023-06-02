import { Component, OnInit } from '@angular/core';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import esLocale from '@fullcalendar/core/locales/es';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})


export class CalendarioComponent implements OnInit{

  public events: any[];
  public options: any;
  ngOnInit() {

    this.events = [
      {
        title: "Gimnasio",
        start: "2023-06-02T12:00:00",
        end: "2023-06-02T14:00:00",
      },
      {
        title: "Gimnasio",
        start: "2023-06-12T16:00:00",
        end: "2023-06-12T18:00:00"
      },
      {
        title: "Gimnasio",
        start: "2023-06-20T10:00:00",
        end: "2023-06-20T12:00:00"
      },
      {
        title: "Crossfit",
        start: "2023-06-20T13:00:00",
        end: "2023-06-20T1:00:00"
      },

    ]
  }

  calendarOptions: CalendarOptions = {
    locale: esLocale,
    initialView: 'dayGridMonth',
    firstDay: 0,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: true,
      meridiem: 'short',
      hour12: true
    },
    nowIndicator: true,
    plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,today,next dayGridMonth,timeGridWeek,timeGridDay'
    },
    themeSystem: 'bootstrap5',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    dayHeaderFormat:{
      weekday:'long'
    },
    buttonText: {
      prev: '<',
      next: '>'
    },
    views: {
      timeGridWeek: {
        hour12: true
      }
    }
  };
  
}
