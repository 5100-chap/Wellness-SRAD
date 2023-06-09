import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Form, FormGroup, FormControl } from '@angular/forms';
import { AlumnoStatusResponse } from '../models/alumnoStatusResponse.model';
import { Area } from '../models/area.model';
import { Subscription } from 'rxjs';
import { HorarioReserva } from '../models/horario-reserva';
import { ChartService } from '../services/chart.service';
import { DatePipe } from '@angular/common';
import { ReseñaArea } from '../models/reseña-area';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-gimnasio',
  templateUrl: './gimnasio.component.html',
  styleUrls: ['./gimnasio.component.css'],
})
export class GimnasioComponent implements OnInit {

  //Definición de variables y arreglos a utilizar
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  now!: Date;
  today = new Date();
  areaId: number = 0;
  semanaSeleccionada!: number;
  dateControl = new FormControl();
  private subscription: Subscription | undefined;
  seleReserva: Reservas = new Reservas();
  public chart: any;
  aforoData: String = '';
  alumnoStatus: number = -1;
  actuales!: number;
  totales!: number;
  closeResult: string = '';

  resenias : ReseñaArea[] = [];

  Limpieza !: number;
  Calidad !: number;
  Ambiente !: number;

  horario!: boolean;

  //Definición del constructor
  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private chartService: ChartService,
    private router: Router,
  ) {}

  //Pipe para darle formato a la fecha y hora
  pipe = new DatePipe('es');
  changedDate = this.pipe.transform(this.today, 'longDate');


  //Metodo para obtener el rango semanal para las reservas
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



  // Horarios de reserva 
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
  
  

  //Metodo para actualizar el dia y horario
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



  // Revisa si el aforo del lugar ya está lleno
  lleno(): boolean{
    return this.totales > this.actuales;
  }

  ngOnInit(): void {
    this.obtenerReseñas();
    this.obtenerNumeroCalifRubro("Limpieza")
    this.obtenerNumeroCalifRubro("Calidad del equipo")
    this.obtenerNumeroCalifRubro("Ambiente")
  
    this.apiService.getAreaByName('gimnasio').subscribe((response) => {
      this.now = new Date();
      this.areaId = response[0].AreaId;
      if (!response[0].Estatus) {
        this.router.navigate([
          '/error-gimnasio-cerrado',
        ]);
      }
      this.getAforoArea();
      this.getAlumnoStatus();
      this.subscription = this.dateControl.valueChanges.subscribe(()=>{
        this.semanaSeleccionada = +this.dateControl.value.slice(6);
        this.getDiasSemana();
        this.apiService.getTodasReservas(this.listaDias[0], this.listaDias[6], this.areaId).subscribe((data: HorarioReserva[])=>{
          this.listaDeHorariosReservados = data;
          this.apiService.getDiasEscolares(this.listaDias[0]).subscribe(
            (data: any)=>{
              this.horario = data;
            }
          );
        }, error=>{
        });
      });
    });
  }

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
      this.listaDias.push(`${i.getFullYear()}-${(i.getMonth()+1>9)?i.getMonth()+1:`0${i.getMonth()+1}`}-${(i.getDate()>9)?i.getDate():`0${i.getDate()}`}`);
    }
  }

  // Crea la reserva dependiendo del día y hora seleccionados
  horaSeleccionada!: string;
  diaSeleccionado!: string;
  crearReserva(){
    if(this.diaSeleccionado!=undefined && this.horaSeleccionada!=undefined){
      this.apiService.crearReserva(this.authService.currentUserValue['username'], this.diaSeleccionado, this.horaSeleccionada, '', this.areaId).subscribe(error=>{
      });
    }
  }

  // Recarga la página desde el HTML
  reload(){
    window.location.reload();
  }
  
  // Imprimir en 'horario seleccionado' la fecha correcta
  imprimirFechaCorrecta(index: number, dia: number){
    this.diaSeleccionado = this.listaDias[dia];
    this.horaSeleccionada = this.reservaArray[index].hora;
    this.reservaArray[index].fecha = this.listaDias[dia] + " - " + this.reservaArray[index].hora.slice(0, 5) + " --> " + ((+this.reservaArray[index].hora.slice(0, 2)) + 2) + ":00";
  }

  // Para sabados y domingos
  finesDeSemana(hora: string){
    const horaDate = new Date(0, 0, 0, +hora.slice(0, 2), +hora.slice(3, 5), +hora.slice(6))
    return (horaDate < new Date(0, 0, 0, 9, 0, 0) || horaDate > new Date(0, 0, 0, 17, 0, 0))
  }

  // Revisa si el horario del botón está ocupado/deshabilitado
  ocupado(dia: number, hora: string): boolean{
    if(!this.horario){
      return false;
    }
    else if(!this.lleno()){
      return false;
    }
    else if(this.diaPasado(dia, hora) || this.semanaSeleccionada===undefined){
      return false;
    }
    else if(dia>4 && this.finesDeSemana(hora)){
      return false;
    }
    else if(!this.diaPasado(dia, hora) && this.listaDeHorariosReservados.length===0){
      return true;
    }
    let yaExistenEseDia = 0;
    for(let each of this.listaDeHorariosReservados){
      if(each.dia.slice(0, 10) === this.listaDias[dia] && each.hora.slice(11, 19) === hora){
        yaExistenEseDia++;
      }
    }
    if(yaExistenEseDia/this.listaDeHorariosReservados.length <= this.listaDeHorariosReservados.length){
      // Esta condicion solo aplica a aquellas reservas hechas por el mismo usuario
      for(let i=0; i<this.listaDeHorariosReservados.length; i++){
        if(this.listaDeHorariosReservados[i].dia.slice(0, 10) === this.listaDias[dia] && this.listaDeHorariosReservados[i].hora.slice(11, 19) === hora && this.listaDeHorariosReservados[i].usuario === this.authService.currentUserValue['username']){
          return false;
        }
      }
      // Ahora falta verificar si ya ha reservado mucho en el mismo día, por el usuario que use la app
      let reservasPorDia = 0;
      for(let each of this.listaDeHorariosReservados){
        if(each.dia.slice(0, 10) === this.listaDias[dia] && each.usuario === this.authService.currentUserValue['username']){
          reservasPorDia++;
        }
      }
      if(reservasPorDia>this.totales/2){
        return false;
      }
      return true;
    }
    return false;
  }

  // Revisa si ese horario ya pasó de fecha
  diaPasado(dia: number, hora: string): boolean{
    if(this.listaDias.length === 0){
      return false;
    }
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
   
  //Método para aumentar un +1 al aforo del gimansio
  aumentarAforo(): void {
    this.apiService.aumentarAforo(this.areaId).subscribe((error) => {
      console.error('Error fetching area id status: ', error);
    });
  }

  //Método para desminuit un -1 al aforo del gimansio
  disminuirAforo(): void {
    this.apiService.disminuirAforo(this.areaId).subscribe((error) => {
      console.error('Error fetching area id status', error);
    });
  }
  
  //Método para obtener el aforo actual y total del area deportiva
  getAforoArea(): void {
    this.apiService.consultarAforo(this.areaId).subscribe(
      (data: any) => {
        const actuales = Number(data['actuales']);
        const totales = Number(data['totales']);
        const ocupados = totales - actuales;
        this.totales = totales;
        this.actuales = actuales;

        this.aforoData = actuales + '/' + totales;
        // Usa este metodo para crear la grafica mediante un servicio
        this.chart = this.chartService.createPieChart('MyChart', ['Libre: ' + ocupados, 'Ocupado: ' + actuales], [ocupados, actuales]);
        
      },
      (error) => {
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
      this.reload();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.reload();
      return 'by clicking on a backdrop';
    } else {
      this.reload();
      return `with: ${reason}`;
    }
  }

  // Dependiendo si esta afuera o adentro del gimnasio, crea un registro o marca la salida del registro ya existente
  marcarLlegadaOSalida() {
    this.apiService
      .marcar(this.authService.currentUserValue['username'], this.areaId)
      .subscribe();
    this.getAlumnoStatus();
    this.getAforoArea();
    window.location.reload();
  }

//Modal para la sección de reseñas
  abrir(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-resena' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  //Metodo para crear la reseña del alumno 
  confirmarReview(limpieza: string, calidad: string, ambiente: string){
    var selectLimpieza = Number(limpieza);
    var selectCalidad = Number(calidad);
    var selectAmbiente = Number(ambiente);
  
    this.apiService.calificarArea(this.areaId, selectLimpieza, selectCalidad, selectAmbiente, 'Limpieza', 'Calidad del equipo', 'Ambiente').subscribe(error=>{
    });
  }

  //Metodo para obtener las reseñas del gimnasio
  obtenerReseñas(){
    this.apiService.getReseniasArea(1).subscribe((data: ReseñaArea[]) => {
      this.resenias = data;
    } ,
    error=>{
      console.error(error);
    });
  }

  //Metodo para obtener el numero total de registros de un rubro que se pase como parametro
  obtenerNumeroCalifRubro(rubro: string){

    if(rubro == "Limpieza"){
      this.apiService.getNumRegistrosArea(1, rubro).subscribe((data: number) => {
        this.Limpieza = data[0].NumeroRegistros;
  
      } ,
      error=>{
        console.error(error);
      });

    } else if (rubro == "Calidad del equipo") {
      this.apiService.getNumRegistrosArea(1, rubro).subscribe((data: number) => {
        this.Calidad = data[0].NumeroRegistros;
  
      } ,
      error=>{
        console.error(error);
      });

    } else {
      this.apiService.getNumRegistrosArea(1, rubro).subscribe((data: number) => {
        this.Ambiente = data[0].NumeroRegistros;
  
      } ,
      error=>{
        console.error(error);
      });

    }

  }


  //Metodo para calcular el promedio de las reseñas de cada rubro
  calcularPromedio(calif: number, numRegistros: number){
    let res = (calif/numRegistros).toFixed(1);
    return(res)
  }

}
