import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service'; // actualiza esta ruta al path correcto
import { Area } from '../models/area.model'; // actualiza esta ruta al path correcto
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  title = 'appBootstrap';
  closeResult: string = '';
  areas: Area[] = []; // variable para guardar las áreas
  tipoUsuario = this.authService.currentUserValue //Obtener el tipo de usuario
  
  constructor(private modalService: NgbModal, private apiService: ApiService, private authService: AuthService) {}
  

   //Función para saber si el usuario es un administrador 
   isAdmin(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Administrador' ;
  }

  //Función para saber si el usuario es un asesor
  isInstructor(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Instructor' ;
  }

   //Función para saber si el usuario es un asesor
   isDirector(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Director' ;
  }
  
  //Método para utilizar una imagen default en caso de no tener una asignada.
  updateUrl(event: any) {
    event.target.src = '../assets/img/fondo.jpeg';
  }

  ngOnInit(): void {
    this.apiService.getTodasAreasInformacion().subscribe((areas: Area[]) => {
      this.areas = areas;
    }, (error) => {
    });
  }

  //Método para abrir el area  en caso de estar cerrada
  openArea(areaId: number, content:any) {
    this.apiService.updateAreaStatus(areaId, true).subscribe((area: Area) => {
      // Actualiza la lista de áreas después de cambiar el estado
      this.ngOnInit();
    }, (error) => {
    });
    
    // Abre el modal después de hacer la llamada a la API
    this.open(content);
  }


  //Metodo para abrir el modal
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //Metodo para cerrar el modal
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

