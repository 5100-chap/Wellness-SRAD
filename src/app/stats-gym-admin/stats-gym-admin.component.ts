import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { AforoSemanalResponse } from '../models/aforoSemanalResponse';
import { Area } from '../models/area';
import { IngresosPorHora } from '../models/ingresoPorHora';

@Component({
  selector: 'app-stats-gym-admin',
  templateUrl: './stats-gym-admin.component.html',
  styleUrls: ['./stats-gym-admin.component.css'],
})
export class StatsGymAdminComponent implements OnInit, OnDestroy {
  //Creacion de las variables para las graficas
  //Grafica de barras
  public chart: any;
  //Grafico de lineas
  public lineChart: any;
  //Selector para el grafico de barras
  dateControl = new FormControl();
  //Selector para el grafico de lineas
  dayControl = new FormControl();
  AreaInfo: Area[] = [];
  //Suscripcion utilizada para la grafica de barras
  private subscription: Subscription | undefined;
  //Suscripcion utilizada para el grafico de lineas
  private subscription2: Subscription | undefined;

  constructor(private apiService: ApiService) {}

  //Grafico de barras
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
        scales: {
          x: {
            title: {
              display: true,
              text: 'Dia',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Ingresos',
            },
          },
        },
      },
    });
  }

  //Grafico de lineas
  createLineChart(labels: string[], data: number[]) {
    // Si ya existe un gráfico, lo destruimos
    if (this.lineChart) {
      this.lineChart.destroy();
    }
  
    this.lineChart = new Chart('linea', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: data,
            borderColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hora'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Ingresos'
            }
          }
        }
      },
    });
  }

  ngOnInit(): void {
    this.apiService.getAreaByName('gimnasio').subscribe((response) => {
      this.AreaInfo = response;
    });

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
    //Define el nombre de los meses
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
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
          .getAforoSemanal(formattedDate, this.AreaInfo[0].AreaId)
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
            const labels = Object.keys(attendanceByDay).map((day, index) => {
              const currentDay = new Date(ISOweekStart);
              currentDay.setDate(currentDay.getDate() + index);
              return `${day} ${currentDay.getDate()} de ${
                monthNames[currentDay.getMonth()]
              }`;
            });
            const dataPoints = Object.values(attendanceByDay);

            this.createChart(labels, dataPoints);
            console.log(data);
          });
      }
    );

    this.subscription2 = this.dayControl.valueChanges.subscribe(
      (value: string) => {
        this.apiService
          .getIngresosPorHora(value, this.AreaInfo[0].AreaId)
          .subscribe((data: IngresosPorHora[]) => {
            // Inicializar un objeto con todas las horas del día y ingresos 0
            const ingresosPorHora: { [hora: number]: number } = {};
            for (let i = 0; i < 24; i++) {
              ingresosPorHora[i] = 0;
            }
    
            // Llenar el objeto con los datos obtenidos
            for (const item of data) {
              ingresosPorHora[item.Hora] = item.Ingresos;
            }
    
            // Crear los arreglos labels y dataPoints a partir del objeto
            const labels = Object.keys(ingresosPorHora).map(hour => `${hour}:00 hrs`);
            const dataPoints = Object.values(ingresosPorHora);
    
            this.createLineChart(labels, dataPoints);
          });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription2?.unsubscribe();
  }
}
