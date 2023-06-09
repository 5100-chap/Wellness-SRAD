import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Area } from '../models/area.model';

@Component({
  selector: 'app-lista-areas',
  templateUrl: './lista-areas.component.html',
  styleUrls: ['./lista-areas.component.css'],
})
export class ListaAreasComponent implements OnInit {
  areas: Area[] = [];

  constructor(private apiService: ApiService) {}

  updateUrl(event: any) {
    event.target.src = '../assets/img/fondo.jpeg';
  }

  ngOnInit() {
    this.apiService.getTodasAreasInformacion().subscribe((data: Area[]) => {
      this.areas = data;
    });
  }
}
