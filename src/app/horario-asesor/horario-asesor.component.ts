import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { AsesorInfo } from '../models/asesor-info';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ReservaAsesor } from '../models/reserva-asesor';

@Component({
  selector: 'app-horario-asesor',
  templateUrl: './horario-asesor.component.html',
  styleUrls: ['./horario-asesor.component.css'],
})
export class HorarioAsesorComponent {
  websiteList: any = [
    'Semana 20 - 26 de Marzo 2023',
    'Semana 27 - 31 de Marzo 2023',
    'Semana 20 - 26 de Marzo 2023',
  ];
  asesor!: AsesorInfo;
  dateControl = new FormControl();
  private subscription: Subscription | undefined;
  semanaSeleccionada!: number;
  diaSeleccionado: string = '';
  horaSeleccionada: string = '';
  listaDias: string[] = [];
  now!: Date;
  asesorInfo!: AsesorInfo;
  listaReservasConAsesor!: ReservaAsesor[];
  activateButton: boolean = false;
  horarioSeleccionadoInput: string = '';
  horario!: boolean;
  seleReserva: Reservas = new Reservas();

  img!: string;

  form = new FormGroup({
    website: new FormControl('', Validators.required),
  });

  get f() {
    return this.form.controls;
  }

  reload() {
    window.location.reload();
  }

  submit() {}

  changeWebsite(e: any) {}

  reservaArray: Reservas[] = [
    {
      id: 1,
      id_matricula_alumno: '',
      id_area_deportiva: 7,
      fecha: '',
      rangoDeHora: '6:00 - 8:00',
      hora: '06:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: '',
      id_area_deportiva: 6,
      fecha: '',
      rangoDeHora: '8:00 - 10:00',
      hora: '08:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: '',
      id_area_deportiva: 6,
      fecha: '',
      rangoDeHora: '10:00 - 12:00',
      hora: '10:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 3,
      id_matricula_alumno: '',
      id_area_deportiva: 8,
      fecha: '',
      rangoDeHora: '12:00 - 14:00',
      hora: '12:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 4,
      id_matricula_alumno: '',
      id_area_deportiva: 7,
      fecha: ' ',
      rangoDeHora: '14:00 - 16:00',
      hora: '14:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 8,
      fecha: '',
      rangoDeHora: '16:00 - 18:00',
      hora: '16:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 8,
      fecha: '',
      rangoDeHora: '18:00 - 20:00',
      hora: '18:00:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: '',
      id_area_deportiva: 8,
      fecha: '',
      rangoDeHora: '20:00 - 22:00',
      hora: '20:00:00',
      estado: '',
      id_instructor: '',
    },
  ];

  openForEdit(reserve: Reservas) {
    this.seleReserva = reserve;
  }
  // Imprimir en 'horario seleccionado' la fecha correcta
  imprimirFechaCorrecta(index: number, dia: number) {
    this.diaSeleccionado = this.listaDias[dia];
    this.horaSeleccionada = this.reservaArray[index].hora;
    this.reservaArray[index].fecha =
      this.listaDias[dia] +
      ' - ' +
      this.reservaArray[index].hora.slice(0, 5) +
      ' --> ' +
      (+this.reservaArray[index].hora.slice(0, 2) + 2) +
      ':00';
  }

  //Función para obtener los días de la semana
  getDiasSemana() {
    this.listaDias = [];
    const primerDiaAnio = new Date(this.now.getFullYear(), 0, 1);
    const diasParaLunes = (primerDiaAnio.getDay() + 6) % 7;
    const primerLunesDelAnio = new Date(
      this.now.getFullYear(),
      0,
      1 + (7 - diasParaLunes)
    );
    const diasSuma = (this.semanaSeleccionada - 1) * 7;
    const lunes = new Date(primerLunesDelAnio.getTime() + diasSuma * 86400000); // a partir del primer lunes del año, le suma los días que faltan para este lunes en millisegundos
    const week = new Date(70, 0, 7); // una semana completa
    const cont = new Date(70, 0, 1, 18, 0, 0); // un dia completo
    const domingo = new Date(lunes.getTime() + week.getTime());
    for (
      let i = lunes;
      i <= domingo;
      i = new Date(i.getTime() + cont.getTime())
    ) {
      this.listaDias.push(
        `${i.getFullYear()}-${
          i.getMonth() + 1 > 9 ? i.getMonth() + 1 : `0${i.getMonth() + 1}`
        }-${i.getDate() > 9 ? i.getDate() : `0${i.getDate()}`}`
      );
    }
  }

  ngOnInit(): void {
    //Se obtiene la información del asesor
    const data: any = this.route.snapshot.paramMap.get('asesor');
    this.asesorInfo = JSON.parse(data);
    this.now = new Date();

    //Se obtiene los horarios disponibles del asesor
    this.subscription = this.dateControl.valueChanges.subscribe(() => {
      this.semanaSeleccionada = +this.dateControl.value.slice(6);
      this.getDiasSemana();
      this.apiService
        .getReservasAsesor(
          this.listaDias[0],
          this.listaDias[6],
          this.asesorInfo.asesor
        )
        .subscribe((data: ReservaAsesor[]) => {
          this.listaReservasConAsesor = data;
          this.apiService
            .getDiasEscolares(this.listaDias[0])
            .subscribe((data: any) => {
              this.horario = data;
            });
        });
    });

    setTimeout(() => {
      this.getImagen(this.asesorInfo.numero_nomina);
    }, 500);
  }

  // Al picarle al boton del dia y hora, se colocarán como los dia y hora seleccionados
  seleccionar(dia: number, hora: string, i: number) {
    this.diaSeleccionado = this.listaDias[dia];
    this.horaSeleccionada = hora;
    this.horarioSeleccionadoInput = `${this.diaSeleccionado} -> ${this.reservaArray[i].rangoDeHora}`;
    this.activateButton = true;
  }

  // Para realizar la reserva dependiendo del horario seleccionado
  // Falta agregar la opcion de elegir lugar
  reservar() {
    this.apiService
      .createReservaAsesor(
        this.asesorInfo.asesor,
        'Gimnasio',
        this.diaSeleccionado,
        this.authService.currentUserValue['username'],
        this.horaSeleccionada,
        0
      )
      .subscribe(
        () => {

        },
        (error) => {

        }
      );
  }

  // Posible eliminacion de esta funcion
  selecDisable() {
    this.activateButton = false;
  }

  // Checar si un horario esta ocupado
  ocupado(hora: string, dia: number): boolean {
    if (!this.horario) {
      return false;
    } else if (
      this.diaPasado(dia, hora) ||
      this.listaReservasConAsesor === undefined
    ) {
      return false;
    }
    // Falta que cheque si ya hay reservas en este horario
    for (let each of this.listaReservasConAsesor) {
      if (
        each.hora.slice(11, 19) === hora &&
        each.fecha.slice(0, 10) === this.listaDias[dia]
      ) {
        return false;
      }
    }
    return true;
  }

  // Revisa si ese horario ya pasó de fecha
  diaPasado(dia: number, hora: string): boolean {
    if (this.listaDias.length === 0) {
      return false;
    }
    const ant = new Date(
      +this.listaDias[dia].slice(0, 4),
      +this.listaDias[dia].slice(5, 7) - 1,
      +this.listaDias[dia].slice(8),
      +hora.slice(0, 2),
      +hora.slice(3, 5),
      +hora.slice(6)
    );
    return ant < this.now;
  }

  cambiarFechaDelDia(dia: number, hora: string) {
    for (let each of this.reservaArray) {
      each.fecha = `${this.listaDias[dia]} --> ${hora}`;
    }
  }

  //En caso de haber un error manda una foto predeterminada
  updateUrl(event: any) {
    event.target.src =
      'https://miro.medium.com/v2/resize:fit:1024/1*fNLMb7DHUQfn18w8YvyLQA.png';
  }

  //Metodo para obtener la foto del asesor
  getImagen(id: string) {
    this.apiService.getImagenAsesor(id).subscribe((data: string) => {
      this.img = data[0]['imagen'];
    });
  }

  closeResult: string = '';

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

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
