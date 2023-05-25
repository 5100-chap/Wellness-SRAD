import { Component } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';
import { Casilleros } from '../models/casilleros';
import { ApiService } from '../services/api.service';
import { NumCasillerosDisponibles } from '../models/num-casilleros-disponibles';

declare var window: any;

@Component({
  selector: 'app-lockers',
  templateUrl: './lockers.component.html',
  styleUrls: ['./lockers.component.css'],
})
export class LockersComponent {

  /** Definiciones de variables*/
  casilleros: Casilleros[] = [];

  constructor(private apiService: ApiService, private modalService: NgbModal) {}
  
  CasillerosDisponibles : NumCasillerosDisponibles[] = [];

  seleReserva: Casilleros = new Casilleros();


  /**  Obtención de la información de los casilleros disponibles*/

  ngOnInit(): void {
    this.getCasillerosDis();
    this.getDisponibilidad();

  
  }
  getCasillerosDis(){

    this.apiService.getCasillerosDisponibles().subscribe((data: Casilleros[]) => {
      this.casilleros = data;
      console.log(this.casilleros)
    });
  }

  getDisponibilidad(){
    this.apiService.getDisponibilidadCasillero().subscribe((data: NumCasillerosDisponibles[]) => {
      this.CasillerosDisponibles = data;
      console.log(this.CasillerosDisponibles)
    });

  }

  actulizarCasilleroSelecccionado(seleccionado : Casilleros){
    this.seleReserva = seleccionado;
   
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
