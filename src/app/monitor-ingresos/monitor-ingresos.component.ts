import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { IngresosMonitor } from '../models/ingresos-monitor';
import { ApiService } from '../services/api.service';
import { DatePipe, Time } from '@angular/common';
import {FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ExisteAlumno } from '../models/existe-alumno';
import { ChangeDetectorRef } from '@angular/core';




declare var window: any;

@Component({
  selector: 'app-monitor-ingresos',
  templateUrl: './monitor-ingresos.component.html',
  styleUrls: ['./monitor-ingresos.component.css']
})
export class MonitorIngresosComponent {

  //Definición de variables

  constructor(private modalService: NgbModal, private apiservice:ApiService, private cdr: ChangeDetectorRef) {}

  closeResult: string = '';
  today = new Date();
  ingresos : IngresosMonitor[] = [];
  temp !: string;
  existe : ExisteAlumno[] = [];

  modalBody: string = 'Esperando...';

  /** Pipe para darle formato la fecha y hora*/
  pipe = new DatePipe('es');

  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');


  /*Definición del formulario para la validación de los campos */
     
  NuevoIngresoForm = new FormGroup({
    matricula: new FormControl('', [Validators.required, Validators.pattern(/^A0.*/), Validators.maxLength(9)]),
  
  });
  


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

  //Función para obtener el dia al cambiar el input
  alCambiar(dateString : string){
  
    this.obtenerRegistros(dateString)
  }

  //Función para obtener la información de los ingresos
  obtenerRegistros(dia : string){

    this.apiservice.getMonitorIngresos(dia).subscribe((data: IngresosMonitor[]) => {
      this.ingresos = data;
    });
  }

  //Función para marcar la salida de un alumno
  marcarSalida(horaEntrada: string, matricula: string ){

    let hora = String(this.today.getHours() )
    let minutos = String(this.today.getMinutes())
    let segundos = String(this.today.getSeconds())
  
    let horaSalidaFormateada = hora + ":" + minutos + ":" + segundos

    this.apiservice.marcarSalidaAlumnoManual(horaSalidaFormateada,matricula,horaEntrada).subscribe(error => {
      console.error(error);
    
      this.modalBody = "Salida registrada correctamente!"


    });

  }

  //Función para marcar un ingreso de un alumno de forma manual
  marcarLlegada(matricula: string){

    let hora = String(this.today.getHours() )
    let minutos = String(this.today.getMinutes())
    let segundos = String(this.today.getSeconds())
  
    let horaFormateada = hora + ":" + minutos + ":" + segundos

    const res = String(this.changedDate)

    
    this.apiservice.consultarAlumno(matricula).subscribe((data: ExisteAlumno[]) => {
      this.existe = data;

      if(this.existe[0].existe == 0){
        this.modalBody = "Matricula no registrada"
        

      } else if(this.existe[0].existe == 1){

        this.apiservice.marcarLlegadaGimnasioAlumno(matricula, res, horaFormateada).subscribe(error => {
          console.error(error);
          this.modalBody = "Llegada registrada correctamente!"

        });
      }
    });
  }

  //Funcion para refrescar la pagina
  refresh(){
    window.location.reload();
  }

  

ngOnInit(): void{

  const res = String(this.changedDate)

  this.obtenerRegistros(res);

  }


  //Función para exportar la información de la tabla en un archivo con el formato csv
  exportarCSV(){
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
    saveAs(blob, 'IngresoSemanal.csv');
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
      this.refresh();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.refresh();
      return 'by clicking on a backdrop';
    } else if(reason == "okay"){
      return 'okay'
    } else {
      this.refresh();
      return  `with: ${reason}`;
    }
  }

}
