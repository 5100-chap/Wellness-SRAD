import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nueva-area',
  templateUrl: './nueva-area.component.html',
  styleUrls: ['./nueva-area.component.css']
})



export class NuevaAreaComponent  {
  
  /* Validación de los campos */
  NuevaAreaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    aforo: new FormControl('', Validators.required  ),
    ubicación: new FormControl('', Validators.required),
    imagen: new FormControl('', Validators.required),
    horaInicio: new FormControl('', Validators.required),
    horaFinal: new FormControl('', Validators.required),
    
  });

  resultado!: string;
  value!: string;
  today = new Date();

   /** Pipe para darle formato la fecha y hora*/
   pipe = new DatePipe('es');
   changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');


/* Validar si todos los campos han sido llenados */
  submit() {
    if (this.NuevaAreaForm.valid)
      this.resultado = "Todos los datos son válidos";
    else
      this.resultado = "Hay datos inválidos en el formulario";
  }

   

  /* Creación del modal*/

  closeResult: string = '';
     
  constructor(private modalService: NgbModal) {  }


  ngOnInit() {}
    

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