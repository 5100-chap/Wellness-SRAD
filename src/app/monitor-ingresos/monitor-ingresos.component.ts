import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { IngresosMonitor } from '../models/ingresos-monitor';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-monitor-ingresos',
  templateUrl: './monitor-ingresos.component.html',
  styleUrls: ['./monitor-ingresos.component.css']
})
export class MonitorIngresosComponent {

  title = 'appBootstrap';
    
  closeResult: string = '';
  
  
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

  ingresos : IngresosMonitor[] = [];

  ngOnInit(): void{
    this.apiservice.getMonitorIngresos().subscribe((data: IngresosMonitor[]) => {
      this.ingresos = data;
    })
  }
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(private modalService: NgbModal , private apiservice:ApiService) {}
     
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
