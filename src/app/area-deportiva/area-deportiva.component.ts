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
import { ReseñaArea } from '../models/reseña-area';

@Component({
  selector: 'app-area-deportiva',
  templateUrl: './area-deportiva.component.html',
  styleUrls: ['./area-deportiva.component.css'],
})
export class AreaDeportivaComponent implements OnInit {

  //Defenición del constructor
  constructor(
    private chartService: ChartService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}


  // Declaramos las variables y arrays que vamos a utilizar
  areaActual : Area = new Area;
  public nombreArea: string = '';
  aforoData: string = '';
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  now!: Date;
  totales!: number;
  semanaSeleccionada!: number;
  dateControl = new FormControl();
  private subscription: Subscription | undefined;
  private updateReservaArray : Subscription | undefined;
  seleReserva: Reservas = new Reservas();
  public chart: any;
  alumnoStatus: number = -1;
  closeResult: string = '';
  horaSeleccionada!: string;
  diaSeleccionado!: string;

  resenias : ReseñaArea[] = [];
  Limpieza !: number;
  Calidad !: number;
  Ambiente !: number;

  horario !: boolean;
  actuales!: number;

 


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


  // Método para obtener la información del area deportiva formateada
  getFormattedNombreArea(): string {
    return this.nombreArea
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  //Método para obtener el rango semanal para las reservaciones
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

  //Metodo para actualizar el dia y horario
  openForEdit(reserve: Reservas) {
    this.seleReserva = reserve;
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
    crearReserva(){
      if(this.diaSeleccionado!=undefined && this.horaSeleccionada!=undefined){
        this.apiService.crearReserva(this.authService.currentUserValue['username'], this.diaSeleccionado, this.horaSeleccionada, '', this.areaActual.AreaId).subscribe(error=>{
          console.log(error);
        });
      }
    }

    // Metodo para recargar la pagina
    reload(){
      window.location.reload();
    }
    
    // Imprimir en 'horario seleccionado' la fecha correcta
    imprimirFechaCorrecta(index: number, dia: number){
      this.diaSeleccionado = this.listaDias[dia];
      this.horaSeleccionada = this.reservaArray[index].hora;
      this.reservaArray[index].fecha = this.listaDias[dia] + " - " + this.reservaArray[index].hora.slice(0, 5) + " --> " + ((+this.reservaArray[index].hora.slice(0, 2)) + 2) + ":00";
    }

  // Revisa si el aforo del lugar ya está lleno
  lleno(): boolean{
    return this.totales > this.actuales;
  }
  
  // Revisa si el horario del botón está ocupado
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
      if(reservasPorDia>this.totales){
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
    //Método para aumentar un +1 al aforo del area deportiva
    aumentarAforo(): void {
      this.apiService.aumentarAforo(this.areaActual.AreaId).subscribe((error) => {
        console.error('Error fetching area id status: ', error);
      });
    }

    //Método para desminuit un -1 al aforo del area deportiva
    disminuirAforo(): void {
      this.apiService.disminuirAforo(this.areaActual.AreaId).subscribe((error) => {
        console.error('Error fetching area id status', error);
      });
    }

   //Metodo para obtener la información del area deportiva seleccionada
   obtenerAreaDeportiva(){
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
              this.apiService.getDiasEscolares(this.listaDias[0]).subscribe(
                (data: any)=>{
                  this.horario = data;
                }
              );
            }, error=>{
              console.log(error);
            });
          })
        }
      }); 
    }
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
  
    this.apiService.calificarArea(this.areaActual.AreaId, selectLimpieza, selectCalidad, selectAmbiente, 'Limpieza', 'Calidad del equipo', 'Ambiente').subscribe(error=>{
      console.log(error);
    });
  }

  //Metodo para obtener las reseñas del gimnasio
  obtenerReseñas(){
    this.apiService.getReseniasArea(this.areaActual.AreaId).subscribe((data: ReseñaArea[]) => {
      this.resenias = data;
      console.log(data)
    } ,
    error=>{
      console.error(error);
    });
  }

  //Metodo para obtener el numero total de registros de un rubro que se pase como parametro
  obtenerNumeroCalifRubro(rubro: string){

    if(rubro == "Limpieza"){
      this.apiService.getNumRegistrosArea(this.areaActual.AreaId, rubro).subscribe((data: number) => {
        this.Limpieza = data[0].NumeroRegistros;
  
      } ,
      error=>{
        console.error(error);
      });

    } else if (rubro == "Calidad del equipo") {
      this.apiService.getNumRegistrosArea(this.areaActual.AreaId, rubro).subscribe((data: number) => {
        this.Calidad = data[0].NumeroRegistros;
  
      } ,
      error=>{
        console.error(error);
      });

    } else {
      this.apiService.getNumRegistrosArea(this.areaActual.AreaId, rubro).subscribe((data: number) => {
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



  ngOnInit(): void {
    this.obtenerAreaDeportiva()

    setTimeout(() => {
    this.obtenerReseñas();
    this.obtenerNumeroCalifRubro("Limpieza")
    this.obtenerNumeroCalifRubro("Calidad del equipo")
    this.obtenerNumeroCalifRubro("Ambiente")
      
    }, 500);
    
   
  }


  //Método para obtener el aforo actual y total del area deportiva
  getAforoArea(): void {
    this.apiService.consultarAforo(this.areaActual.AreaId).subscribe(
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
}
