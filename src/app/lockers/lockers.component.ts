import { Component } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';
import { Casilleros } from '../models/casilleros';
import { ApiService } from '../services/api.service';
import { NumCasillerosDisponibles } from '../models/num-casilleros-disponibles';
import { AuthService } from '../services/auth.service';
import { ReservaCasillero } from '../models/reserva-casillero';



declare var window: any;

@Component({
  selector: 'app-lockers',
  templateUrl: './lockers.component.html',
  styleUrls: ['./lockers.component.css'],
})
export class LockersComponent {

  /** Definiciones de variables*/
  

  constructor(private apiService: ApiService, private modalService: NgbModal, private authService: AuthService) {}
  casilleros: Casilleros[] = [];

  CasillerosDisponibles : NumCasillerosDisponibles[] = [];

  seleReserva: Casilleros = new Casilleros();

  CasilleroReservado !: ReservaCasillero ;


  /**  Obtención de la información de los casilleros disponibles*/

  ngOnInit(): void {
    this.getCasillerosDis();
    this.getDisponibilidad();
    this.getCasilleroReservado();
  }
  getCasillerosDis(){
    this.apiService.getCasillerosDisponibles().subscribe((data: Casilleros[]) => {
      this.casilleros = data;
      
    });
  }


  getDisponibilidad(){
    this.apiService.getDisponibilidadCasillero().subscribe((data: NumCasillerosDisponibles[]) => {
      this.CasillerosDisponibles = data;
    });

  }

  getCasilleroReservado(){
    const matricula = this.authService.currentUserValue['username']; // Obtener la matricula del alumno

    this.apiService.consultarReservaCasillero(matricula).subscribe((data: ReservaCasillero) => {
      this.CasilleroReservado = data;
      
    });

  }

  actulizarCasilleroSelecccionado(seleccionado : Casilleros){
    this.seleReserva = seleccionado;
  }

  checarImagenSubida(){
    if(this.CasilleroReservado.estado === "Confirmada"){
      if (this.CasilleroReservado.comprobante.length > 0){
        return false;
      }
      else return true;
    }
    else return true;
  }

  crearReservaCasillero(){
    const alumno = this.authService.currentUserValue['username']; // Obtener la matricula del alumno
    const casillero = this.seleReserva.id

    
    this.apiService.crearReservaCasillero(alumno,casillero).subscribe(error => {
      console.error('Error fetching area id status', error);
    });
  }

  actualizarEstadoCasillero(){
    const casillero = this.seleReserva.id
    

    this.apiService.actualizarEstadoCasillero(casillero, 1).subscribe(error => {
      console.error('Error fetching area id status', error);
  });
  }


  refresh(){
    window.location.reload();
  }
  


/* Creación del modal*/

  closeResult: string = '';

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  

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


  boton1(event: any) {
    alert(event.target.innerHTML);

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
