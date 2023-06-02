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
    plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    themeSystem: 'bootstrap5',
    firstDay: 0
  };
  
}
