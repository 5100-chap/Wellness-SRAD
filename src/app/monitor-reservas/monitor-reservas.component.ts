import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormControl} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { DatePipe, Time } from '@angular/common';
import { ReservasCasillero } from '../models/reservas-casillero';
import { saveAs } from 'file-saver';
import { MonitorReservas } from '../models/monitor-reservas';
import { InfoNombreAreasD } from '../models/info-nombre-areas-d';

@Component({
  selector: 'app-monitor-reservas',
  templateUrl: './monitor-reservas.component.html',
  styleUrls: ['./monitor-reservas.component.css']
})
export class MonitorReservasComponent {

  //Definición del constructor
  constructor(private modalService: NgbModal, private apiservice:ApiService) {}

  //Definición de variables
  closeResult: string = '';
  AreaSeleccionada : string = "Gimnasio";
  DiaSeleccionado !: string;
  today = new Date();
  reservasCasillero : ReservasCasillero[] = [];
  reservasArea: MonitorReservas[] = [];

  // Pipe para darle formato la fecha y hora
  pipe = new DatePipe('es');
  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');


  areas: InfoNombreAreasD[] = [];
  

  //Formulario   
  form = new FormGroup({  
    website: new FormControl('', Validators.required)  
  }); 
  
    
  //Función para obtener el area deportiva seleccionada
  changeArea(e:any) {  
    this.AreaSeleccionada = e.target.value
    this.getDataReservas(this.DiaSeleccionado,this.AreaSeleccionada);
  } 

  //Función para obtener el dia seleccionado
  changeDia(e:any){
    this.DiaSeleccionado = e.target.value
    this.getDataReservas(this.DiaSeleccionado,this.AreaSeleccionada);
  }

  //Función para obtener los registros de las reservas de los casilleros
  getReservasCasillero(){
    this.apiservice.getReservasCasillero().subscribe((data: ReservasCasillero[]) => {
      this.reservasCasillero = data;
    });
  }

  //Función para obtener los registros de las reservas en las areas deportivas
  getDataReservas(dia:string, area:string)
  {
    this.apiservice.getMonitorReservas(dia,area).subscribe((data: MonitorReservas[]) => {
      this.reservasArea = data;
      
    });
  }

   //Función para formatear la hora
  formatHora(hora: string){
   
    let horaFormateada = this.pipe.transform(hora, 'hh:mm:ss a', 'GMT');
    return horaFormateada
  }

  //Función para formatear el dia
  formatDia(dia: string){   
    const date = new Date(dia);
    date.setDate(date.getDate() + 1)

    let diaFormateado = this.pipe.transform(date, 'd MMMM y');
    return diaFormateado
  }

  getNombreAreas(){
    this.apiservice.getNombreAreasDeportivas().subscribe((data: InfoNombreAreasD[]) => {
      this.areas = data;
  
    });

  }


  ngOnInit(): void{
    this.getNombreAreas()
    this.getReservasCasillero()
    const res = String(this.changedDate)
    this.DiaSeleccionado = res
    this.getDataReservas(res, this.AreaSeleccionada)
  }

   //Función para exportar la información de la tabla de reservas de casilleros en un archivo con el formato csv
   exportarCSVCasilleros(){
    const table = document.querySelector('.table') as HTMLTableElement;
    const rows = Array.from(table.querySelectorAll('tr'));

    let csvContent : string =  '';
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      
      //Exclude last Column
      const rowData = cells
      .slice(0, cells.length - 3)
      .map((cell) => cell.textContent)
      .join(',');

      csvContent += rowData + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'ReservasCasilleros.csv');
  }

   //Función para exportar la información de la tabla de reservas en areas deportivas en un archivo con el formato csv
   exportarCSVAreas(){
    const table = document.querySelector('.table') as HTMLTableElement;
    const rows = Array.from(table.querySelectorAll('tr'));

    let csvContent : string =  '';
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      
      //Exclude last Column
      const rowData = cells
      .slice(0, cells.length - 1)
      .map((cell) => cell.textContent)
      .join(',');

      csvContent += rowData + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'ReservasAreasDeportivas.csv');
  }
    

     
  
     
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
