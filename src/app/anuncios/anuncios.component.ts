import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { Anuncio } from '../models/anuncio';
import { DatePipe } from '@angular/common';

//Variable para poder acceder a funciones de la pantalla
declare var window: any;

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent {

   /** Definiciones de variables*/
   constructor(private apiService: ApiService, private modalService: NgbModal, private authService: AuthService) {}
   anuncios : Anuncio [] = [];
   today = new Date();

   /** Pipe para darle formato a la fecha*/
   pipe = new DatePipe('es');


   /** Función que se ejecuta al inic */
   ngOnInit(): void {
    this.getAnuncios()
  }

  // Función para cambiar el formato de la fecha que se pase como parametro
  cambiarFormato(fecha:Date){
    let changedDate = this.pipe.transform(fecha, 'd MMMM y');
    return changedDate
  }

  // Función para obtener los casilleros disponibles de la base de datos
  getAnuncios(){
    this.apiService.getAnuncios().subscribe((data: Anuncio[]) => {
      this.anuncios = data;
    });
  }

}
