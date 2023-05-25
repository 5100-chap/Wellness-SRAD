// Importamos las librerías y componentes necesarios
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
import { Area } from '../models/area.model';
import { ChartService } from '../services/chart.service';


@Component({
  selector: 'app-area-deportiva',
  templateUrl: './area-deportiva.component.html',
  styleUrls: ['./area-deportiva.component.css'],
})
export class AreaDeportivaComponent implements OnInit {
  // Declaramos las variables y arrays que vamos a utilizar|
  areaActual : Area = new Area;
  public nombreArea: string = '';
  aforoData: string = '';
  //Deprecated manejo de fechas
  // Array de meses para manejo de fechas
  meses = [
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
  now!: Date; // Variable que almacenará la fecha actual

  // Este método calcula el rango de la semana actual y retorna un string
  getSemanaRange(l: number, r: number): String {
    const now = new Date();
    let res = '';
    const firstWeekNow = new Date(0, 0, l);
    const lastWeekNow = new Date(0, 0, r);
    let firstDay = now.getDate() - now.getDay() + firstWeekNow.getDate();
    let lastDay = now.getDate() - now.getDay() + lastWeekNow.getDate();
    if (firstDay < 0) {
      res += `Semana ${firstDay} de ${
        this.meses[now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1]
      }`;
    } else {
      res += `Semana ${firstDay}`;
    }

    const primerDiaMesSiguiente = new Date(
      now.getMonth() + 1 > 11 ? now.getFullYear() + 1 : now.getFullYear(),
      now.getMonth() + 1 > 11 ? 0 : now.getMonth() + 1,
      1
    );
    const ultimoDiaDelMes = new Date(primerDiaMesSiguiente.getTime() - 1);
    if (lastDay > ultimoDiaDelMes.getDate()) {
      res += ` de ${this.meses[now.getMonth()]} - ${
        lastDay - ultimoDiaDelMes.getDate()
      } de ${
        this.meses[now.getMonth() + 1 > 11 ? 0 : now.getMonth() + 1]
      } ${now.getFullYear()}`;
    } else {
      res += ` - ${lastDay} de ${
        this.meses[now.getMonth()]
      } ${now.getFullYear()}`;
    }
    return res;
  }

  form = new FormGroup({
    website: new FormControl('', Validators.required),
  });

  getFormattedNombreArea(): string {
    return this.nombreArea
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
  }

  changeWebsite(e: any) {
    console.log(e.target.value);
  }

  reservaArray: Reservas[] = [
    {
      id: 1,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '17-04-2023 6:00 - 8:00',
      rangoDeHora: '6:00 - 8:00',
      hora: '06:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '18-04-2023 8:00 - 10:00 ',
      rangoDeHora: '8:00 - 10:00',
      hora: '8:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '18-04-2023 10:00 - 12:00',
      rangoDeHora: '10:00 - 12:00',
      hora: '10:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 3,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '19-04-2023 12:00 - 14:00',
      rangoDeHora: '12:00 - 14:00',
      hora: '12:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 4,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '20-04-2023 14:00 - 16:00 ',
      rangoDeHora: '14:00 - 16:00',
      hora: '14:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '21-04-2023 16:00 - 18:00',
      rangoDeHora: '16:00 - 18:00',
      hora: '16:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '21-04-2023 18:00 - 20:00',
      rangoDeHora: '18:00 - 20:00',
      hora: '18:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '21-04-2023 20:00 - 22:00',
      rangoDeHora: '20:00 - 22:00',
      hora: '20:00',
      estado: '',
      id_instructor: '',
    },
  ];
  
  seleReserva: Reservas = new Reservas();
  addOrEdit() {
    if (this.seleReserva.id == 0) {
      this.seleReserva.id = this.reservaArray.length + 1;
      this.reservaArray.push(this.seleReserva);
    }
    this.seleReserva = new Reservas();
  }

  openForEdit(reserve: Reservas) {
    this.seleReserva = reserve;
  }

  delete() {
    if (confirm('Deseas realmente eliminar la reservación?')) {
      this.reservaArray = this.reservaArray.filter(
        (x) => x != this.seleReserva
      );
      this.seleReserva = new Reservas();
    }
  }

  public chart: any;


  title = 'appBootstrap';

  closeResult: string = '';

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    private chartService: ChartService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    const nombreAreaParam = this.route.snapshot.paramMap.get('nombreArea');
    if (nombreAreaParam === null) {
      this.router.navigate(['/']);
    } else {
      this.nombreArea = nombreAreaParam;
    }
    this.apiService.getAreaByName(this.nombreArea).subscribe((response) => {
      this.areaActual = response[0];
      this.getAforoArea();
      this.now = new Date();
    });
  }

  getAforoArea(): void {
    this.apiService.consultarAforo(this.areaActual.AreaId).subscribe(
      (data: any) => {
        const actuales = Number(data['actuales']);
        const totales = Number(data['totales']);
        const ocupados = totales - actuales;
  
        this.aforoData = actuales + '/' + totales;
        // Use service method to create chart
        this.chart = this.chartService.createPieChart('MyChart', ['Libre: ' + actuales, 'Ocupado: ' + ocupados], [ocupados, actuales]);
      },
      (error) => {
        console.log('Error fetching aforo status:', error);
      }
    );
  }
  
  /**
   * Write code on Method
   *
   * @return response()
   */
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
