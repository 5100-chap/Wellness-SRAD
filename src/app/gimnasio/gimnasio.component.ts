
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
import { Reservas } from '../models/reservas';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms';
import { AlumnoStatusResponse } from '../models/alumnoStatusResponse';
import { Area } from '../models/area';

declare var window: any;


@Component({
  selector: 'app-gimnasio',
  templateUrl: './gimnasio.component.html',
  styleUrls: ['./gimnasio.component.css'],
})
export class GimnasioComponent implements OnInit {

  Areainfo: Area[] = [];
  areaId: number = 0;

  reservaArray: Reservas[] = [
    {
      id: 1,
      id_matricula_alumno: 'A00960720',
      id_area_deportiva: 7,
      fecha: '17-04-2023 6:00 - 8:00',
      hora: '6:00 - 8:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: 'A00952209',
      id_area_deportiva: 6,
      fecha: '18-04-2023 8:00 - 10:00 ',
      hora: '8:00 - 10:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: 'A00952209',
      id_area_deportiva: 6,
      fecha: '18-04-2023 10:00 - 12:00',
      hora: '10:00 - 12:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 3,
      id_matricula_alumno: 'A00149174',
      id_area_deportiva: 8,
      fecha: '19-04-2023 12:00 - 14:00',
      hora: '12:00 - 14:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 4,
      id_matricula_alumno: 'A00640163',
      id_area_deportiva: 7,
      fecha: '20-04-2023 14:00 - 16:00 ',
      hora: '14:00 - 16:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: 'A00773407',
      id_area_deportiva: 8,
      fecha: '21-04-2023 16:00 - 18:00',
      hora: '16:00 - 18:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: 'A00773407',
      id_area_deportiva: 8,
      fecha: '21-04-2023 18:00 - 20:00',
      hora: '18:00 - 20:00',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: 'A00773407',
      id_area_deportiva: 8,
      fecha: '21-04-2023 20:00 - 22:00',
      hora: '20:00 - 22:00',
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
  aforoData: String = "";
  alumnoStatus: number = -1;
  

  createChart(actuales: Number, totales: Number) {
    var xValues = ['Libre', 'Ocupado'];
    var yValues = [actuales, totales];

    var barColors = ['#6c9bcf', '#654e92'];
    this.chart = new Chart('MyChart', {
      type: 'pie', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: xValues,
        datasets: [
          {
            data: yValues,
            backgroundColor: barColors,

            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  ngOnInit() : void {
    this.getAforoArea();
    this.getAlumnoStatus();

    this.apiService.getAreaByName('gimnasio').subscribe((response) => {
      this.Areainfo = response;
      this.areaId = this.Areainfo[0].AreaId;
    });
  }

  getAlumnoStatus(): void {
    const usuario = this.authService.currentUserValue['username']; // Replace with the actual user value you want to send
    this.apiService.verificarLlegada(usuario).subscribe(
      (data: AlumnoStatusResponse) => {
        this.alumnoStatus = data.status;
      },
      error => {
        console.error('Error fetching alumno status:', error);
      }
    );
  }

  aumentarAforo(): void{
    this.apiService.aumentarAforo(this.areaId).subscribe(error => {
      console.error('Error fetching area id status: ', error);
    });
  }

  disminuirAforo(): void{
    this.apiService.disminuirAforo(this.areaId).subscribe(error => {
      console.error('Error fetching area id status', error);
    });
  }

  getAforoArea(): void{

    this.apiService.consultarAforo(this.areaId).subscribe(
      (data: any) =>{
        this.aforoData = data['actuales'] + "/" + data['totales'];
        this.createChart(Number(data['actuales']), Number(data['totales']));
      },
      error => {
        console.log('Error fetching aforo status:', error);
      }
    );
  }

  getStatus() : void {
    console.log(this.alumnoStatus);
  }

  title = 'appBootstrap';

  closeResult: string = '';
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

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

  marcarLlegadaOSalida() {
    this.apiService.marcar(this.authService.currentUserValue['username'], this.areaId).subscribe();
    this.getAlumnoStatus();
    this.getAforoArea();
    window.location.reload();
  }
}
