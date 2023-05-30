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
import { Subscription } from 'rxjs';
import { HorarioReserva } from '../models/horario-reserva';
import { AlumnoStatusResponse } from '../models/alumnoStatusResponse.model';

@Component({
  selector: 'app-area-deportiva',
  templateUrl: './area-deportiva.component.html',
  styleUrls: ['./area-deportiva.component.css'],
})
export class AreaDeportivaComponent implements OnInit {

  // Declaramos las variables y arrays que vamos a utilizar
  areaActual : Area = new Area;
  public nombreArea: string = '';
  aforoData: string = '';
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  now!: Date;

  getFormattedNombreArea(): string {
    return this.nombreArea
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getSemanaRange(l: number, r: number): String {
    const now = new Date();
    let res = '';
    const firstWeekNow = new Date(0, 0, l);
    const lastWeekNow = new Date(0, 0, r);
    let firstDay = now.getDate() - now.getDay() + firstWeekNow.getDate();
    let lastDay = now.getDate() - now.getDay() + lastWeekNow.getDate();
    if (firstDay < 0) {
      res += `Semana ${firstDay} de ${this.meses[now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1]
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
      res += ` de ${this.meses[now.getMonth()]} - ${lastDay - ultimoDiaDelMes.getDate()
        } de ${this.meses[now.getMonth() + 1 > 11 ? 0 : now.getMonth() + 1]
        } ${now.getFullYear()}`;
    } else {
      res += ` - ${lastDay} de ${this.meses[now.getMonth()]
        } ${now.getFullYear()}`;
    }
    return res;
  }

  semanaSeleccionada!: number;
  dateControl = new FormControl();
  private subscription: Subscription | undefined;
  private updateReservaArray : Subscription | undefined;
  reservaArray: Reservas[] = [
    {
      id: 1,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '6:00 - 8:00',
      rangoDeHora: '6:00 - 8:00',
      hora: '06:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '8:00 - 10:00 ',
      rangoDeHora: '8:00 - 10:00',
      hora: '08:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '10:00 - 12:00',
      rangoDeHora: '10:00 - 12:00',
      hora: '10:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 3,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '12:00 - 14:00',
      rangoDeHora: '12:00 - 14:00',
      hora: '12:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 4,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '14:00 - 16:00 ',
      rangoDeHora: '14:00 - 16:00',
      hora: '14:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '16:00 - 18:00',
      rangoDeHora: '16:00 - 18:00',
      hora: '16:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '18:00 - 20:00',
      rangoDeHora: '18:00 - 20:00',
      hora: '18:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 1,
      fecha: '20:00 - 22:00',
      rangoDeHora: '20:00 - 22:00',
      hora: '20:00:00',
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


  public chart: any;
  alumnoStatus: number = -1;


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

    // Obtener el rango de días de la semana, desde lunes hasta domingo, en base a la semana que seleccionó
    listaDeHorariosReservados: HorarioReserva[] = [];
    listaDias: string[] = [];
    getDiasSemana(){
      this.listaDias = [];
      const primerDiaAnio = new Date(this.now.getFullYear(), 0, 1);
      const diasParaLunes = (primerDiaAnio.getDay()+6)%7;
      const primerLunesDelAnio = new Date(this.now.getFullYear(), 0, 1 + (7 - diasParaLunes));
      const diasSuma = (this.semanaSeleccionada-1)*7;
      const lunes = new Date(primerLunesDelAnio.getTime() + diasSuma * 86400000); // a partir del primer lunes del año, le suma los días que faltan para este lunes en millisegundos
      const week = new Date(70, 0, 7); // una semana completa
      const cont = new Date(70, 0, 1, 18, 0, 0); // un dia completo
      const domingo = new Date(lunes.getTime()+week.getTime());
      for(let i=lunes; i<=domingo; i=new Date(i.getTime() + cont.getTime())){
        this.listaDias.push(`${i.getFullYear()}-${(i.getMonth()+1>9)?i.getMonth()+1:`0${i.getMonth()+1}`}-${i.getDate()}`);
      }
    }
  
    // Crea la reserva dependiendo del día y hora seleccionados
    horaSeleccionada!: string;
    diaSeleccionado!: string;
    crearReserva(){
      if(this.diaSeleccionado!=undefined && this.horaSeleccionada!=undefined){
        
        this.apiService.crearReserva(this.authService.currentUserValue['username'], this.diaSeleccionado, this.horaSeleccionada, '', this.areaActual.AreaId).subscribe(error=>{
          console.log(error);
        });
      }
    }
  
    reload(){
      window.location.reload();
    }
    
    // Imprimir en 'horario seleccionado' la fecha correcta
    imprimirFechaCorrecta(index: number, dia: number){
      this.diaSeleccionado = this.listaDias[dia];
      this.horaSeleccionada = this.reservaArray[index].hora;
      this.reservaArray[index].fecha = this.listaDias[dia] + " - " + this.reservaArray[index].hora.slice(0, 5) + " --> " + ((+this.reservaArray[index].hora.slice(0, 2)) + 2) + ":00";
    }
  
    // Revisa si el horario del botón está ocupado
    ocupado(dia: number, hora: string): boolean{
      if(this.listaDeHorariosReservados.length===0 || this.diaPasado(dia, hora)){
        return false;
      }
      for(let i=0; i<this.listaDeHorariosReservados.length; i++){
        if(this.listaDeHorariosReservados[i].dia.slice(0, 10) === this.listaDias[dia] && this.listaDeHorariosReservados[i].hora.slice(11, 19) === hora || this.diaPasado(dia, hora)){
          return false;
        }
      }
      return true;
    }
  
    // Revisa si ese horario ya pasó de fecha
    diaPasado(dia: number, hora: string): boolean{
      const ant = new Date(+this.listaDias[dia].slice(0, 4), +this.listaDias[dia].slice(5, 7)-1, +this.listaDias[dia].slice(8), +hora.slice(0, 2), +hora.slice(3, 5), +hora.slice(6));
      return ant < this.now;
    }
  
    // Recibe el estado del alumno, si esta adentro o afuera del area
    getAlumnoStatus(): void {
      const usuario = this.authService.currentUserValue['username']; // Replace with the actual user value you want to send
      this.apiService.verificarLlegada(usuario).subscribe(
        (data: AlumnoStatusResponse) => {
          this.alumnoStatus = data.status;
        },
        (error) => {
          console.error('Error fetching alumno status:', error);
        }
      );
    }
  
    aumentarAforo(): void {
      this.apiService.aumentarAforo(this.areaActual.AreaId).subscribe((error) => {
        console.error('Error fetching area id status: ', error);
      });
    }
  
    disminuirAforo(): void {
      this.apiService.disminuirAforo(this.areaActual.AreaId).subscribe((error) => {
        console.error('Error fetching area id status', error);
      });
    }
  
    
  

  ngOnInit(): void {
    const nombreAreaParam = this.route.snapshot.paramMap.get('nombreArea');
    if (nombreAreaParam === null) {
      this.router.navigate(['/']);
    } else {
      this.nombreArea = nombreAreaParam;
      this.apiService.getAreaByName(this.nombreArea).subscribe((response) => {
        this.areaActual = response[0];
        
        if (this.areaActual.NombreArea === null) {
          this.router.navigate(['/404']);
        }
        if(!this.areaActual.Estatus) {
          this.router.navigate(["/error-" + this.areaActual.NombreArea + "-cerrado"]);
        }
        else{
          this.reservaArray = this.reservaArray.map(reserva => {
            return { ...reserva, id_area_deportiva: this.areaActual.AreaId };
          });          
          this.getAforoArea();
          this.now = new Date();
          this.subscription = this.dateControl.valueChanges.subscribe(()=>{
            this.semanaSeleccionada = +this.dateControl.value.slice(6);
            this.getDiasSemana();
            this.apiService.getTodasReservas(this.listaDias[0], this.listaDias[6], this.areaActual.AreaId).subscribe((data: HorarioReserva[])=>{
              this.listaDeHorariosReservados = data;
              
            }, error=>{
              console.log(error);
            });
          })
        }
      }); 
    }
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
