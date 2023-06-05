import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import esLocale from '@fullcalendar/core/locales/es';
import { Event } from '../models/event.model';
import { Anuncio } from '../models/anuncio';





@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})


export class CalendarioComponent implements OnInit{
  public event : Event;
  public events: any[];
  public options: any;

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.event = new Event();

   
  }

  ngOnInit() {
    this.getCasillerosDis();

/*
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
    */


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

  anuncios : Anuncio [] = [];

  getCasillerosDis(){
    this.apiService.getAnuncios().subscribe((data: Anuncio[]) => {
      this.anuncios = data;
      console.log(this.anuncios)
      
    });
  }


  
}
