import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-crear-anuncio',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css']
})
export class CrearAnuncioComponent {

  //Definición de variables

  resultado!: string;
  value!: string;
  pipe = new DatePipe('en-US');
  

   /*Definición del formulario para la validación de los campos */
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

  // Función para obtener el dia actual
  diaMin(){

   let today = new Date();
   let changedDate = this.pipe.transform(today, 'YYYY-MM-dd');
   
    return String(changedDate);
  }

  // Función para obtener el dia que será dentro de 14 días 
  diaMAX(){

    let after = new Date();

    after.setDate(after.getDate() + 14)
 
     let changedDate = this.pipe.transform(after, 'YYYY-MM-dd');
    
     return String(changedDate);
   }


  ngOnInit():void{
   
  }

  

/* Validar si todos los campos han sido llenados */
  submit(titulo:string,fechaini:string,fechafin:string,ubicacion:string,imagen: string,desc:string,duracionIni:string,duracionFin:string) {
  //submit(){
    if (this.NuevoAnuncioForm.valid)
      // this.resultado = "Todos los datos son válidos";
      this.apiservice.crearAnuncio(fechaini,fechafin,ubicacion,desc,duracionIni,duracionFin,imagen,titulo).subscribe(error => {
        console.log(error);
      });
      //console.log(titulo,fechaini,fechafin,ubicacion,imagen,desc,duracionIni,duracionFin);
      else
      this.resultado = "Hay datos inválidos en el formulario";
  }


  /* Creación del modal*/
    
  closeResult: string = '';
     

  constructor(private modalService: NgbModal, private apiservice: ApiService) {}
     
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
