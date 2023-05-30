import { Component,  ElementRef,  Input,  OnInit,  SimpleChanges,  ViewChild } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Reservas } from '../models/reservas.model';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormControl} from '@angular/forms';
import { AsesorInfo } from '../models/asesor-info';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ReservaAsesor } from '../models/reserva-asesor';

@Component({
  selector: 'app-horario-asesor',
  templateUrl: './horario-asesor.component.html',
  styleUrls: ['./horario-asesor.component.css']
})
export class HorarioAsesorComponent {

  websiteList: any = ['Semana 20 - 26 de Marzo 2023', 'Semana 27 - 31 de Marzo 2023', 'Semana 20 - 26 de Marzo 2023']  
  asesor!: AsesorInfo;
  dateControl = new FormControl();
  private subscription: Subscription | undefined;
  semanaSeleccionada!: number;
  diaSeleccionado!: string;
  horaSeleccionada!: string;
  listaDias: string[] = [];
  now!: Date;
  asesorInfo!: AsesorInfo;
  listaReservasConAsesor!: ReservaAsesor[];
    
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

  reservaArray: Reservas[] = [
    {id:1, id_matricula_alumno: "A00960720", id_area_deportiva:7, fecha: "17-04-2023 6:00 - 8:00", rangoDeHora: "6:00 - 8:00", hora: "06:00:00", estado: "", id_instructor: ""},
    {id:2, id_matricula_alumno: "A00952209", id_area_deportiva:6, fecha: "18-04-2023 8:00 - 10:00 ", rangoDeHora: "8:00 - 10:00", hora: "08:00:00", estado: "", id_instructor: ""},
    {id:2, id_matricula_alumno: "A00952209", id_area_deportiva:6, fecha: "18-04-2023 10:00 - 12:00", rangoDeHora: "10:00 - 12:00", hora: "10:00:00", estado: "", id_instructor: ""},
    {id:3, id_matricula_alumno: "A00149174", id_area_deportiva:8, fecha: "19-04-2023 12:00 - 14:00", rangoDeHora: "12:00 - 14:00", hora: "12:00:00", estado: "", id_instructor: ""},
    {id:4, id_matricula_alumno: "A00640163", id_area_deportiva:7, fecha: "20-04-2023 14:00 - 16:00 ", rangoDeHora: "14:00 - 16:00", hora: "14:00:00", estado: "", id_instructor: ""},
    {id:5, id_matricula_alumno: "A00773407", id_area_deportiva:8, fecha: "21-04-2023 16:00 - 18:00", rangoDeHora: "16:00 - 18:00", hora: "16:00:00", estado: "", id_instructor: ""},
    {id:5, id_matricula_alumno: "A00773407", id_area_deportiva:8, fecha: "21-04-2023 18:00 - 20:00", rangoDeHora: "18:00 - 20:00", hora: "18:00:00", estado: "", id_instructor: ""},
    {id:5, id_matricula_alumno: "A00773407", id_area_deportiva:8, fecha: "21-04-2023 20:00 - 22:00" , rangoDeHora: "20:00 - 22:00", hora: "20:00:00", estado: "", id_instructor: ""}
  ];
  
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

 
  getDiasSemana(){
    this.listaDias = [];
    const primerDiaAnio = new Date(this.now.getFullYear(), 0, 1);
    const diasParaLunes = (primerDiaAnio.getDay()+6)%7;
    const primerLunesDelAnio = new Date(this.now.getFullYear(), 0, 1 + (7 - diasParaLunes));
    const diasSuma = (this.semanaSeleccionada-1)*7;
    const lunes = new Date(primerLunesDelAnio.getTime() + diasSuma * 86400000); // a partir del primer lunes del año, le suma los días que faltan para este lunes en millisegundos
    const week = new Date(70, 0, 7); // una semana completa
    const cont = new Date(70, 0, 1, 18, 0, 0); // un dia completo
    const domingo = new Date(lunes.getTime()+week.getTime());
    for(let i=lunes; i<=domingo; i=new Date(i.getTime() + cont.getTime())){
      this.listaDias.push(`${i.getFullYear()}-${(i.getMonth()+1>9)?i.getMonth()+1:`0${i.getMonth()+1}`}-${(i.getDate()>9)?i.getDate():`0${i.getDate()}`}`);
    }
  }

  ngOnInit(): void {
    const data: any = this.route.snapshot.paramMap.get('asesor');
    this.asesorInfo= JSON.parse(data);
    this.now = new Date();
    this.subscription = this.dateControl.valueChanges.subscribe(()=>{
      this.semanaSeleccionada = +this.dateControl.value.slice(6);
      this.getDiasSemana();
      this.apiService.getReservasAsesor(this.listaDias[0], this.listaDias[6]).subscribe(
        (data: ReservaAsesor[])=>{
          this.listaReservasConAsesor = data;
          console.log(data);
        });
    });
  }

  ocupado(hora: string, dia: number): boolean{
    if(this.diaPasado(dia, hora) || this.listaReservasConAsesor === undefined){
      return false;
    }
    // Falta que cheque si ya hay reservas en este horario
    for(let each of this.listaReservasConAsesor){
      if(each.hora.slice(11, 19) === hora && each.fecha.slice(0, 10) === this.listaDias[dia]){
        return false;
      }
    }
    return true;
  }

  // Revisa si ese horario ya pasó de fecha
  diaPasado(dia: number, hora: string): boolean{
    if(this.listaDias.length === 0){
      return false;
    }
    const ant = new Date(+this.listaDias[dia].slice(0, 4), +this.listaDias[dia].slice(5, 7)-1, +this.listaDias[dia].slice(8), +hora.slice(0, 2), +hora.slice(3, 5), +hora.slice(6));
    return ant < this.now;
  }


  title = 'appBootstrap';
    
  closeResult: string = '';
     
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(private modalService: NgbModal, 
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService) {}
     
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
