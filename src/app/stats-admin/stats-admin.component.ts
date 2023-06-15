import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import Chart, { Legend, plugins } from 'chart.js/auto'; // Para la visualización de gráficos
import 'chartjs-plugin-labels'; // Plugin adicional para los gráficos
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; // Para uso de modales con Bootstrap
import { Reservas } from '../models/reservas.model'; // Modelo de datos para las reservas
import { NgClass } from '@angular/common'; // Para manipulación dinámica de clases CSS
import { ApiService } from '../services/api.service'; // Servicio API para la comunicación backend
import { AuthService } from '../services/auth.service'; // Servicio de autenticación
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms'; // Para construcción y manejo de formularios
import { Subscription } from 'rxjs';
import { Area } from '../models/area.model';
import { ChartService } from '../services/chart.service';
import { AforoSemanalResponse } from '../models/aforoSemanalResponse.model';
import { IngresosPorHora } from '../models/ingresoPorHora.model';
@Component({
  selector: 'app-stats-admin',
  templateUrl: './stats-admin.component.html',
  styleUrls: ['./stats-admin.component.css'],
})
export class StatsAdminComponent {
  public chart: any;
  public lineChart: any;
  nombreArea: string = '';
  areaActual: Area = new Area();
  aforoData: string = '';
  dateControl = new FormControl();
  dayControl = new FormControl();
  private subscription: Subscription | undefined;
  private subscription2: Subscription | undefined;
  // Definir los nombres de los días de la semana
  private daysOfWeek = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  //Define el nombre de los meses
  private monthNames = [
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
  constructor(
    private chartService: ChartService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  createChart(labels: string[], data: number[]) {
    this.chartService.destroyChart(this.chart);
    this.chart = this.chartService.createChart('Dia', labels, data, 'bar');
  }

  createLineChart(labels: string[], data: number[]) {
    this.chartService.destroyChart(this.lineChart);
    this.lineChart = this.chartService.createChart(
      'linea',
      labels,
      data,
      'line'
    );
  }

  getAforoArea(): void {
    this.apiService.consultarAforo(this.areaActual.AreaId).subscribe(
      (data: any) => {
        const actuales = Number(data['actuales']);
        const totales = Number(data['totales']);
        const ocupados = totales - actuales;
        const porcentajeOcupacion = (ocupados / totales) * 100;
        this.aforoData = ' (' + porcentajeOcupacion.toFixed(2) + '%)';
        // Use service method to create chart
        this.chart = this.chartService.createPieChart(
          'MyChart',
          ['Libre: ' + actuales, 'Ocupado: ' + ocupados],
          [ocupados, actuales]
        );
      },
      (error) => {
      }
    );
  }

  ngOnInit(): void {
    const nombreAreaParam = this.route.snapshot.paramMap.get('nombreArea');
    if (nombreAreaParam === null) {
      this.router.navigate(['/']);
    } else {
      this.nombreArea = nombreAreaParam;
    }
    this.apiService.getAreaByName(this.nombreArea).subscribe((response) => {
      this.areaActual = response[0];
      if (
        this.areaActual.NombreArea.toLocaleLowerCase() !==
        nombreAreaParam?.toLocaleLowerCase()
      ) {
        this.router.navigate(['/']);
      }
    });

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
          .getAforoSemanal(formattedDate, this.areaActual.AreaId)
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
              attendanceByDay[this.daysOfWeek[item.DayOfWeek - 1]] =
                item.AttendanceCount;
            }
            // Crear los arreglos labels y dataPoints a partir del objeto
            const labels = Object.keys(attendanceByDay).map((day, index) => {
              const currentDay = new Date(ISOweekStart);
              currentDay.setDate(currentDay.getDate() + index);
              return `${day} ${currentDay.getDate()} de ${
                this.monthNames[currentDay.getMonth()]
              }`;
            });
            const dataPoints = Object.values(attendanceByDay);

            this.createChart(labels, dataPoints);
          });
      }
    );

    this.subscription2 = this.dayControl.valueChanges.subscribe(
      (value: string) => {
        this.apiService
          .getIngresosPorHora(value, this.areaActual.AreaId)
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
            const labels = Object.keys(ingresosPorHora).map(
              (hour) => `${hour}:00 hrs`
            );
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
