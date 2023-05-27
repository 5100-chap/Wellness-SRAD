import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { Anuncio } from '../models/anuncio';


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


   ngOnInit(): void {
    this.getCasillerosDis()
    
  }

  getCasillerosDis(){
    this.apiService.getAnuncios().subscribe((data: Anuncio[]) => {
      this.anuncios = data;
      console.log(this.anuncios)
      
    });
  }







}
