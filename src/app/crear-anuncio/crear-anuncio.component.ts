import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-anuncio',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css']
})
export class CrearAnuncioComponent {
 
  pipe = new DatePipe('en-US');
  

   /* Validación de los campos */
   NuevoAnuncioForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    fechaEventoInicio: new FormControl('', Validators.required  ),
    fechaEventoFin: new FormControl('', Validators.required  ),
    ubicacion: new FormControl('', Validators.required),
    imagen: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    DuracionAnuncioInicio: new FormControl('', Validators.required  ),
    DuracionAnuncioFin: new FormControl('', Validators.required  ),

  });

  diaMin(){

   let today = new Date();
   let changedDate = this.pipe.transform(today, 'YYYY-MM-dd');
   
    return String(changedDate);
  }



  diaMAX(){

    let after = new Date();

    after.setDate(after.getDate() + 14)
 
     let changedDate = this.pipe.transform(after, 'YYYY-MM-dd');
    
     return String(changedDate);
   }


   actualiza(){
    console.log("fg")

   }



  ngOnInit():void{
   // this.changeFormat()
  }

  resultado!: string;
  value!: string;

/* Validar si todos los campos han sido llenados */
  submit() {
    if (this.NuevoAnuncioForm.valid)
      this.resultado = "Todos los datos son válidos";
    else
      this.resultado = "Hay datos inválidos en el formulario";
  }



  /* Creación del modal*/
    
  closeResult: string = '';
     

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
