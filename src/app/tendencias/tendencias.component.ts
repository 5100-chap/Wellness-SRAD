import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ChartService } from '../services/chart.service';
import { TendenciasModel } from '../models/tendencias.model';
import { TendenciasHoraData  } from '../models/tendenciaHora.model';
@Component({
  selector: 'app-tendencias',
  templateUrl: './tendencias.component.html',
  styleUrls: ['./tendencias.component.css'],
})
export class TendenciasComponent implements OnInit, OnDestroy {
  graficaPorSegmentoBloque: any;
  graficaPorHora: any;
  segmentoControl = new FormControl();
  bloqueControl = new FormControl();
  semanaControl = new FormControl();
  fechaControl = new FormControl();
  private subscription: Subscription | undefined;
  private subscription2: Subscription | undefined;

  constructor(
    private apiService: ApiService,
    private chartService: ChartService
  ) {}

  ngOnInit() {
    
    //Llamamos los datos de la API y los graficamos en la pagina
    this.subscription = this.semanaControl.valueChanges.subscribe(
      (semana: string) => {
        let segmento = this.segmentoControl.value;
        const bloque = this.bloqueControl.value;

        this.apiService
          .obtenerTendencias(segmento, +bloque, +semana)
          .subscribe((res) => {
            const tendencias = new TendenciasModel(res.tendencias);
            const datosFormateados = this.formatearDatos(tendencias);
            this.chartService.destroyChart(this.graficaPorSegmentoBloque);
            this.graficaPorSegmentoBloque =
              this.chartService.createStackedChart(
                'graficaPorSegmentoBloque',
                datosFormateados.labels,
                datosFormateados.datasets,
                'bar'
              );
          });
      }
    );

    this.subscription2 = this.fechaControl.valueChanges.subscribe(
      (fecha: string) => {
        this.apiService
          .obtenerTendenciasPorHora(fecha)
          .subscribe((res: any) => {
            const graficaData = this.prepararDatosGraficoLineas(res);
            this.chartService.destroyChart(this.graficaPorHora);
            this.graficaPorHora = this.chartService.createStackedChart(
              'graficaPorHora',
              graficaData.labels,
              graficaData.datasets,
              'line'
            );
          });
      }
    );
  }

  prepararDatosGraficoLineas(data: TendenciasHoraData) {
    const labels: string[] = [];
    const dataset: number[] = [];
  
    // Generar etiquetas y asignar valor 0 a cada hora
    for (let hour = 6; hour <= 22; hour++) {
      const label = hour.toString().padStart(2, '0') + ':00';
      labels.push(label);
      dataset.push(0);
    }
  
    // Asignar valores correspondientes según los datos recibidos
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const hour = parseInt(key);
        if (hour >= 6 && hour <= 22) {
          dataset[hour - 6] = data[key].media;
        }
      }
    }
  
    const datasets = [
      {
        label: 'Media',
        data: dataset,
        borderColor: 'blue',
        fill: false
      }
    ];
  
    return { labels, datasets };
  }

  formatearDatos(tendencias: TendenciasModel) {
    const labels = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    const datasets = [
      {
        label: 'Media',
        data: labels.map(
          (_, i) => tendencias[`Dia${i + 1}_media` as keyof TendenciasModel]
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Máximo',
        data: labels.map(
          (_, i) => tendencias[`Dia${i + 1}_maximo` as keyof TendenciasModel]
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Mínimo',
        data: labels.map(
          (_, i) => tendencias[`Dia${i + 1}_minimo` as keyof TendenciasModel]
        ),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Mediana',
        data: labels.map(
          (_, i) => tendencias[`Dia${i + 1}_mediana` as keyof TendenciasModel]
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Desviación Estándar',
        data: labels.map(
          (_, i) =>
            tendencias[
              `Dia${i + 1}_desviacionEstandar` as keyof TendenciasModel
            ]
        ),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ];

    return { labels, datasets };
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscription2?.unsubscribe();
    this.chartService.destroyChart(this.graficaPorSegmentoBloque);
    this.chartService.destroyChart(this.graficaPorHora);
  }
}
