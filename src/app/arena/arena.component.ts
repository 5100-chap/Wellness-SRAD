import { Component,  ElementRef,  Input,  OnInit,  SimpleChanges,  ViewChild } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormControl} from '@angular/forms';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent {

  websiteList: any = ['Semana 20 - 26 de Marzo 2023', 'Semana 27 - 31 de Marzo 2023', 'Semana 20 - 26 de Marzo 2023']  
    
  form = new FormGroup({  
    website: new FormControl('', Validators.required)  
  });  
    
  get f(){  
    return this.form.controls;  
  }  
    
  submit(){  
    console.log(this.form.value);  
  }  
  
  changeWebsite(e:any) {  
    console.log(e.target.value);  
  }  

  reservaArray : Reservas[] = [
    {id:1, id_matricula_alumno: "A00960720", id_area_deportiva:7, fecha: "17-04-2023 6:00 - 8:00", hora: "6:00 - 8:00", estado: "", id_instructor: ""},
    {id:2, id_matricula_alumno: "A00952209", id_area_deportiva:6, fecha: "18-04-2023 8:00 - 10:00 ", hora: "8:00 - 10:00", estado: "", id_instructor: ""},
    {id:2, id_matricula_alumno: "A00952209", id_area_deportiva:6, fecha: "18-04-2023 10:00 - 12:00", hora: "10:00 - 12:00", estado: "", id_instructor: ""},
    {id:3, id_matricula_alumno: "A00149174", id_area_deportiva:8, fecha: "19-04-2023 12:00 - 14:00", hora: "12:00 - 14:00", estado: "", id_instructor: ""},
    {id:4, id_matricula_alumno: "A00640163", id_area_deportiva:7, fecha: "20-04-2023 14:00 - 16:00 ", hora: "14:00 - 16:00", estado: "", id_instructor: ""},
    {id:5, id_matricula_alumno: "A00773407", id_area_deportiva:8, fecha: "21-04-2023 16:00 - 18:00", hora: "16:00 - 18:00", estado: "", id_instructor: ""},
    {id:5, id_matricula_alumno: "A00773407", id_area_deportiva:8, fecha: "21-04-2023 18:00 - 20:00", hora: "18:00 - 20:00", estado: "", id_instructor: ""},
    {id:5, id_matricula_alumno: "A00773407", id_area_deportiva:8, fecha: "21-04-2023 20:00 - 22:00" , hora: "20:00 - 22:00", estado: "", id_instructor: ""}

  ]
  seleReserva: Reservas = new Reservas();
  addOrEdit(){
    if(this.seleReserva.id == 0){
      this.seleReserva.id = this.reservaArray.length + 1
      this.reservaArray.push(this.seleReserva)
    }
    this.seleReserva = new Reservas();
  }

  openForEdit(reserve: Reservas){
    this.seleReserva = reserve;
  }

  delete(){
    if(confirm("Deseas realmente eliminar la reservación?")){
      this.reservaArray = this.reservaArray.filter (x => x != this.seleReserva);
      this.seleReserva = new Reservas();
    }

  }

 


  ngOnInit(): void {

    
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
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
