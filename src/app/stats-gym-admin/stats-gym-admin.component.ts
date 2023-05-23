import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { AforoSemanalResponse } from '../models/aforoSemanalResponse';
import { Area } from '../models/area';

@Component({
  selector: 'app-stats-gym-admin',
  templateUrl: './stats-gym-admin.component.html',
  styleUrls: ['./stats-gym-admin.component.css'],
})
export class StatsGymAdminComponent implements OnInit, OnDestroy {
  public chart: any;
  dateControl = new FormControl();
  private subscription: Subscription | undefined;

  constructor(private apiService: ApiService) {}

  createChart(labels: string[], data: number[]) {
    // Si ya existe un gráfico, lo destruimos
    if (this.chart) {
      this.chart.destroy();
    }

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

    this.subscription = this.dateControl.valueChanges.subscribe(
      (value: string) => {
        const year = Number(value.slice(0, 4));
        const week = Number(value.slice(-2));

        const date = new Date(year, 0, 1 + (week - 1) * 7);
        const dayOfWeek = date.getDay();
        const ISOweekStart = date;
        if (dayOfWeek <= 4)
          ISOweekStart.setDate(date.getDate() - date.getDay() + 1);
        else ISOweekStart.setDate(date.getDate() + 8 - date.getDay());

        const formattedDate = ISOweekStart.toISOString().split('T')[0];

        this.apiService
          .getAforoSemanal(formattedDate, areaId)
          .subscribe((data: AforoSemanalResponse[]) => {
            // Inicializar un objeto con todos los días de la semana y aforo 0
            const attendanceByDay: { [day: string]: number } = {
              Lunes: 0,
              Martes: 0,
              Miércoles: 0,
              Jueves: 0,
              Viernes: 0,
              Sábado: 0,
              Domingo: 0,
            };

            // Llenar el objeto con los datos obtenidos
            for (const item of data) {
              attendanceByDay[daysOfWeek[item.DayOfWeek - 1]] =
                item.AttendanceCount;
            }

            // Crear los arreglos labels y dataPoints a partir del objeto
            const labels = Object.keys(attendanceByDay);
            const dataPoints = Object.values(attendanceByDay);

            this.createChart(labels, dataPoints);
          });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
