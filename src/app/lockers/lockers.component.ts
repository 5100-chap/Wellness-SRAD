import { Component } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';

declare var window: any;

@Component({
  selector: 'app-lockers',
  templateUrl: './lockers.component.html',
  styleUrls: ['./lockers.component.css'],
})
export class LockersComponent {
  reservaArray: Reservas[] = [
    {
      id: 1,
      id_matricula_alumno: 'A00960720',
      id_area_deportiva: 7,
      fecha: 'Locker 1',
      hora: 'Locker 1',
      estado: '',
      id_instructor: '',
    },
    {
      id: 2,
      id_matricula_alumno: 'A00952209',
      id_area_deportiva: 6,
      fecha: 'Locker 2',
      hora: 'Locker 2',
      estado: '',
      id_instructor: '',
    },
    {
      id: 3,
      id_matricula_alumno: 'A00952209',
      id_area_deportiva: 6,
      fecha: 'Locker 3',
      hora: 'Locker 3',
      estado: '',
      id_instructor: '',
    },
    {
      id: 4,
      id_matricula_alumno: 'A00149174',
      id_area_deportiva: 8,
      fecha: 'Locker 4',
      hora: 'Locker 4',
      estado: '',
      id_instructor: '',
    },
    {
      id: 5,
      id_matricula_alumno: 'A00960720',
      id_area_deportiva: 7,
      fecha: 'Locker 5',
      hora: 'Locker 5',
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

  createChart() {
    var xValues = ['Libre', 'Ocupado'];
    var yValues = [55, 49];

    var barColors = ['#12BB2F', '#F41212'];

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

  ngOnInit(): void {
    this.createChart();
  }

  title = 'appBootstrap';

  closeResult: string = '';

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(private modalService: NgbModal) {}

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
