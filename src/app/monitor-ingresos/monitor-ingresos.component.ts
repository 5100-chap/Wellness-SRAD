import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { IngresosMonitor } from '../models/ingresos-monitor';
import { ApiService } from '../services/api.service';
import { DatePipe, Time } from '@angular/common';




@Component({
  selector: 'app-monitor-ingresos',
  templateUrl: './monitor-ingresos.component.html',
  styleUrls: ['./monitor-ingresos.component.css']
})
export class MonitorIngresosComponent {

  //Definición de variables
  constructor(private modalService: NgbModal , private apiservice:ApiService) {}
  closeResult: string = '';

  today = new Date();
  ingresos : IngresosMonitor[] = [];

  temp = new Date();


  /** Pipe para darle formato la fecha y hora*/
  pipe = new DatePipe('es');

  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');


  //Función para formatear la hora
  formatHora(hora: Date){
   
    let horaFormateada = this.pipe.transform(hora, 'hh:mm a', 'GMT');
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

      console.log(data)
    });

  }



  ngOnInit(): void{

    let anio = String(this.today.getFullYear() )

    this.today.setMonth(this.today.getMonth() + 1)
    
    let mes = String(this.today.getMonth())
   
    let diaN = String(this.today.getDate())

    const res = anio + "-" +mes+"-"+diaN
    
    this.obtenerRegistros(res);


    this.today.setHours(this.today.getHours() );
    console.log(this.today.getHours())
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
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
