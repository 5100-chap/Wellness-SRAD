import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import Chart, { Legend, plugins } from 'chart.js/auto';

interface AforoSemanalResponse {
  DayOfWeek: number;
  AttendanceCount: number;
}

@Component({
  selector: 'app-stats-gym-admin',
  templateUrl: './stats-gym-admin.component.html',
  styleUrls: ['./stats-gym-admin.component.css'],
})
export class StatsGymAdminComponent implements OnInit {
  public chart: any;

  constructor(private apiService: ApiService) {}

  createChart(labels: string[], data: number[]) {
    this.chart = new Chart('Dia', {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: data,
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  ngOnInit(): void {
    const date = '2023-05-17';
    const areaId = 52;

    // Definir los nombres de los días de la semana
    const daysOfWeek = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];

    this.apiService
      .getAforoSemanal(date, areaId)
      .subscribe((data: AforoSemanalResponse[]) => {
        // Convertir de número del día de la semana a nombre del día
        const labels = data.map((item) => daysOfWeek[item.DayOfWeek - 1]);
        const dataPoints = data.map((item) => item.AttendanceCount);

        this.createChart(labels, dataPoints);
      });
  }
}
