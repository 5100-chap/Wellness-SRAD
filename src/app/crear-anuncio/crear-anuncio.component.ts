import { Component, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { HttpResponse } from '@angular/common/http';
declare var window: any;

@Component({
  selector: 'app-crear-anuncio',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css'],
})
export class CrearAnuncioComponent {
  @ViewChild('imageUploadComponent')
  imageUploadComponent?: ImageUploadComponent;

  //Definición de variables
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  closeResult: string = '';
  resultado!: string;
  value!: string;
  today = new Date();

  /** Pipe para darle formato la fecha y hora*/
  pipe = new DatePipe('es');
  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');

  //Selecciona la imagen

  /*Definición del formulario para la validación de los campos */
  NuevoAnuncioForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    fechaEventoInicio: new FormControl('', Validators.required),
    fechaEventoFin: new FormControl('', Validators.required),
    ubicacion: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    DuracionAnuncioInicio: new FormControl('', Validators.required),
    DuracionAnuncioFin: new FormControl('', Validators.required),
  });

  // Función para obtener el dia actual
  diaMin() {
    let today = new Date();
    let changedDate = this.pipe.transform(today, 'YYYY-MM-dd');

    return String(changedDate);
  }

  ngOnInit(): void { }

  /* Validar si todos los campos han sido llenados */
  enviar(
    fechaInicio: string,
    fechaFin: string,
    ubicacion: string,
    descripcion: string,
    duracionIni: string,
    duracionFin: string,
    titulo: string
  ) {

    //Validación de la fechas de inicio y fin de duración del anuncio
    const fecha1: Date = new Date(duracionIni);
    const fecha2: Date = new Date(duracionFin);

    const diferenciaEnMilisegundos: number = fecha2.getTime() - fecha1.getTime();
    const diferenciaEnDias: number = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));


    //Validación de la fechas de inicio y fin de duración del evento
    const fecha1D: Date = new Date(fechaInicio);
    const fecha2D: Date = new Date(fechaFin);
    const diferenciaEnMilisegundosD: number = fecha2D.getTime() - fecha1D.getTime();
    const diferenciaEnDiasD: number = Math.floor(diferenciaEnMilisegundosD / (1000 * 60 * 60 * 24));


    
    if (this.NuevoAnuncioForm.valid) {
      if(diferenciaEnDias <= 14 && diferenciaEnDias > 0 ){
        if(diferenciaEnDiasD > 0){
          if (this.imageUploadComponent) {
            this.apiService
              .createAnuncio(
                fechaInicio,
                fechaFin,
                ubicacion,
                descripcion,
                duracionIni,
                duracionFin,
                'https://tec.mx/sites/default/files/styles/share/public/2020-09/logotipo-borregos-tec-de-monterrey_0.jpg?itok=_VNOFmiK',
                titulo
              )
              .subscribe((error) => {
                console.log(error);
              });
            this.imageUploadComponent.upload();
            this.resultado = "Anuncio creado exitosamente!"
          }

        } else {
          this.resultado = "Las fechas de duración del evento no son válidas. \n Ingrese nuevas fechas";

        }
        

      } else{
        this.resultado = "Las fechas de duración del anuncio tienen una diferencia mayor a 14 dias. \n Ingrese nuevas fechas";
      }

    } else {
      this.resultado = 'Hay datos inválidos en el formulario';
      
    }
  }

  //Actualizar la ventana actual
  refresh() {
    window.location.reload();
  }

  /* Creación del modal*/

  /**
   * Write code on Method
   *
   * @return response()
   */
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;

          if(this.resultado == "Anuncio creado exitosamente!"){
            this.refresh()
          }
         
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          if(this.resultado == "Anuncio creado exitosamente!"){
            this.refresh()
          }
         
        }
      );
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
    } else {
      this.refresh();
      return `with: ${reason}`;
    }
  }
}
