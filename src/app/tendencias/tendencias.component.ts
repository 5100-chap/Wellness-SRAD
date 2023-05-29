import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from '../services/api.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-tendencias',
  templateUrl: './tendencias.component.html',
  styleUrls: ['./tendencias.component.css']
})
export class TendenciasComponent implements OnInit, OnDestroy {
  graficaPorSegmentoBloque: any;
  graficaPorHora: any;
  segmentoSeleccionado: any;
  bloqueSeleccionado: any;
  semanaSeleccionada: any;
  fechaSeleccionada : any;


  constructor(private apiService: ApiService, private chartService: ChartService) { }

  ngOnInit() {
    this.cargarGraficas();
  }

  ngOnDestroy() {
    this.chartService.destroyChart(this.graficaPorSegmentoBloque);
    this.chartService.destroyChart(this.graficaPorHora);
  }

  cargarGraficas() {
    this.apiService.obtenerTendencias('invierno', 1).subscribe(res => {
      this.graficaPorSegmentoBloque = this.chartService.createChart('graficaPorSegmentoBloque', res.labels, res.data, 'bar');
    });

    this.apiService.obtenerTendenciasPorHora('2023-05-28').subscribe(res => {
      this.graficaPorHora = this.chartService.createChart('graficaPorHora', res.labels, res.data, 'line');
    });
  }
  cambiarFecha(event: any) {
    this.fechaSeleccionada = event.target.value;
    this.apiService.obtenerTendenciasPorHora(this.fechaSeleccionada).subscribe(res => {
      this.chartService.actualizarDatosGrafica(this.graficaPorHora, res.labels, res.data);
    });
  }
  
  cambiarSegmento(event: any) {
    this.segmentoSeleccionado = event.target.value;
    this.apiService.obtenerTendencias(this.segmentoSeleccionado, this.bloqueSeleccionado).subscribe(res => {
      this.chartService.actualizarDatosGrafica(this.graficaPorSegmentoBloque, res.labels, res.data);
    });
  }
  cambiarBloque(event: any) {
    this.bloqueSeleccionado = event.target.value;
    this.apiService.obtenerTendencias(this.segmentoSeleccionado, this.bloqueSeleccionado).subscribe(res => {
      this.chartService.actualizarDatosGrafica(this.graficaPorSegmentoBloque, res.labels, res.data);
    });
  }
  cambiarSemana(event: any) {
    // Implementa aquí la lógica necesaria para cambiar la semana
  }
}
