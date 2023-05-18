import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormControl} from '@angular/forms';

@Component({
  selector: 'app-monitor-reservas',
  templateUrl: './monitor-reservas.component.html',
  styleUrls: ['./monitor-reservas.component.css']
})
export class MonitorReservasComponent {

  areas: any = ['Gimnasio', 'Croosfit', 'Arena Tec', 'Arena e-sports'] 
  semanas: any = ['Semana 20 - 26 de Marzo 2023', 'Semana 27 - 31 de Marzo 2023', 'Semana 20 - 26 de Marzo 2023']  
  dias: any = ['Semana 20 - 26 de Marzo 2023', 'Semana 27 - 31 de Marzo 2023', 'Semana 20 - 26 de Marzo 2023']   
    
  form = new FormGroup({  
    website: new FormControl('', Validators.required)  
  });  
    
  get f(){  
    return this.form.controls;  
  }  
    
  submit(){  
    console.log(this.form.value);  
  }  
  
  changeOpcion(e:any) {  
    console.log(e.target.value);  
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
