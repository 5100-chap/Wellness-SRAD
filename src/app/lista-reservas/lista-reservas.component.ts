import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { ReservasAlumno } from '../models/reservas-alumno.model';
import { AsesorNombre } from '../models/asesor-nombre';
import { ReservaAsesorAlumno } from '../models/reserva-asesor-alumno';

@Component({
  selector: 'app-lista-reservas',
  templateUrl: './lista-reservas.component.html',
  styleUrls: ['./lista-reservas.component.css']
})
export class ListaReservasComponent {

  /*Creación del modal*/
    
  closeResult: string = '';
  Reservas!: ReservasAlumno[];
  slices: number[] = [];

  // Reservas con asesor
  ReservasAsesor: ReservaAsesorAlumno[] = [];
     
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


   /*Obtención de las reservas del alumno que ha iniciado sesión*/

  ngOnInit(): void{
    this.getTodasReservasAlumno();
    this.apiService.getReservasAsesorDeAlumno(this.authService.currentUserValue['username']).subscribe((data: ReservaAsesorAlumno[])=>{
      this.ReservasAsesor = data;
    });
  }

  // Genera de forma automatica la hora con su formato en SQL SERVER de forma correcta
  generateHoraActualString(): string{
    const now = new Date();
    return `${(now.getHours()>9)?now.getHours():`0${now.getHours()}`}:${(now.getMinutes()>9)?now.getMinutes():`0${now.getMinutes()}`}:${(now.getSeconds()>9)?now.getSeconds():`0${now.getSeconds()}`}`;
  }

  // Marcar Llegada Asesor
  marcarLlegadaAsesor(id: number){
    this.apiService.marcarLlegadaAsesor(this.generateHoraActualString(), id).subscribe();
  }

  // Marcar Salida Asesor
  marcarSalidaAsesor(id: number){
    this.apiService.marcarSalidaAsesor(this.generateHoraActualString(), id);
  }

  // Cancelar Reserva Asesor
  cancelarReservaAsesor(id: number){
    this.apiService.cancelarReservaAsesor(id).subscribe(error=>{});
  }

  getEstadoAsesor(index: number): string{
    if(this.ReservasAsesor[index].llegada === null && !this.ReservasAsesor[index].cancelada){
      return 'Activa';
    }
    else if(this.ReservasAsesor[index].llegada !== null && this.ReservasAsesor[index].salida === null){
      return 'En curso';
    }
    return 'Cancelada';
  }

  reload(){
    window.location.reload();
  }

  getTodasReservasAlumno(){
    const usuario = this.authService.currentUserValue['username'];
    this.apiService.getTodasReservasAlumno(usuario).subscribe((data: ReservasAlumno[])=>{
      this.Reservas = data;
      if(data.length != 0){
        let ant=data[0]['id_area_deportiva'];
        this.slices.push(0);
        for(let i=1; i<data.length; i++){
          if(ant !== data[i]['id_area_deportiva']){
            ant = data[i]['id_area_deportiva'];
            this.slices.push(i);
          }
        }
        this.slices.push(data.length);
      }
    },
    error=>{
      console.error('Error fetching all reservas from alumno --> ', error);
    });
  }

  cancelarReserva(index: number){
    const usuario = this.authService.currentUserValue['username'];
    this.apiService.cancelarReservaAlumno(usuario, this.Reservas[index]['id']).subscribe(()=>{
    });
  }

  
  marcarLlegada(index: number){
    const usuario = this.authService.currentUserValue['username'];
    this.apiService.marcarLlegadaReserva(usuario, this.Reservas[index]['id_area_deportiva'], this.Reservas[index]['id']).subscribe(()=>{
    });
  }

  marcarSalida(index: number){
    const usuario = this.authService.currentUserValue['username'];
    this.apiService.marcarSalidaReserva(usuario, this.Reservas[index]['id']).subscribe(()=>{
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

  marcarLlegadaBtn(index: number): boolean{
    if(this.Reservas[index]['estado']=='Activa'){
      return true;
    }
    return false;
  }

  reagendarBtn(index: number): boolean{
    if(this.Reservas[index]['estado']=='Activa' || this.Reservas[index]['estado']=='Cancelada'){
      return true;
    }
    return false;
  }

  cancelarReservaBtn(index: number): boolean{
    if(this.Reservas[index]['estado']=='Activa'){
      return true;
    }
    return false;
  }

  marcarSalidaBtn(index: number): boolean{
    if(this.Reservas[index]['estado']=='En curso'){
      return true;
    }
    return false;
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
      return  `with: ${reason}`;
    }
  }

}
