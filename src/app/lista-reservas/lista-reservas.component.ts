import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { ReservasAlumno } from '../models/reservas-alumno.model';

@Component({
  selector: 'app-lista-reservas',
  templateUrl: './lista-reservas.component.html',
  styleUrls: ['./lista-reservas.component.css']
})
export class ListaReservasComponent {

  title = 'appBootstrap';
    
  closeResult: string = '';
  Reservas!: ReservasAlumno[];
     
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private apiService: ApiService
    ) {}
     
  /**
   * Write code on Method
   *
   * @return response()
   */
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  } 

  ngOnInit(): void{
    this.getTodasReservasAlumno();
  }

  getTodasReservasAlumno(){
    const usuario = this.authService.currentUserValue['username'];
    this.apiService.getTodasReservasAlumno(usuario).subscribe((data: ReservasAlumno[])=>{
      this.Reservas = data;
    },
    error=>{
      console.error('Error fetching all reservas from alumno --> ', error);
    });
  }

  tengoAsesor(dato: String): String{
    if(dato==null){
      return "Ninguno";
    }
    else{
      return dato;
    }
  }

  fechaPretty(dato: String): String{
    const dia = new Date(dato.slice(0, 10));
    const nombreMes = dia.toLocaleString('es', {month: 'long'}).charAt(0).toUpperCase() + dia.toLocaleString('es', {month: 'long'}).slice(1);
    const TodosLosDias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado', 'Domingo'];
    const diaSemana = TodosLosDias[dia.getDay()];
    return `${diaSemana} ${dato.slice(8, 10)} de ${nombreMes}`;
  }

  printIndex(index: number){
    console.log(index);
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
      return  `with: ${reason}`;
    }
  }

}
