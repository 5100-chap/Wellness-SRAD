import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Area } from '../models/area.model';
@Component({
  selector: 'app-nueva-area',
  templateUrl: './nueva-area.component.html',
  styleUrls: ['./nueva-area.component.css'],
})
export class NuevaAreaComponent {
  ultimoId = -1;
  @ViewChild('imageUploadComponent')
  imageUploadComponent!: ImageUploadComponent;

  /* Validación de los campos */
  NuevaAreaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    aforo: new FormControl('', Validators.required),
    ubicación: new FormControl('', Validators.required),
    imagen: new FormControl(''),
    horaInicio: new FormControl('', Validators.required),
    horaFinal: new FormControl('', Validators.required),
    material: new FormControl(''),
  });

  resultado!: string;
  value!: string;
  today = new Date();

  /** Pipe para darle formato la fecha y hora*/
  pipe = new DatePipe('es');
  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');

  crearArea(
    nombre: string,
    aforo: string,
    ubicacion: string,
    matDisp: string,
    horaFinal: string,
    horaInicio: string,
    imag: string
  ) {
    // Función auxiliar para verificar si el valor es un string vacío con espacios en blanco
    function esStringVacio(valor: string): boolean {
      return valor.trim() === '';
    }

    //Convertir aforo a numero
    var numAforo: number = parseInt(aforo);
    //Revisamos si el usuario agrego información a los materiales
    // Verificar y asignar null si el valor es un string vacío con espacios en blanco
    var matDispFinal: string | null = esStringVacio(matDisp) ? null : matDisp;
    var nombreFinal: string | null = esStringVacio(nombre) ? null : nombre;
    var ubicacionFinal: string | null = esStringVacio(ubicacion)
      ? null
      : ubicacion;
    var horaFinalFinal: string | null = esStringVacio(horaFinal)
      ? null
      : horaFinal;
    var horaInicioFinal: string | null = esStringVacio(horaInicio)
      ? null
      : horaInicio;
    var imagFinal: string | null = esStringVacio(imag) ? null : imag;

    // Llamar a la función createArea del ApiService con los valores actualizados
    this.apiService
      .createArea(
        nombreFinal,
        null,
        0,
        numAforo,
        ubicacionFinal,
        matDispFinal,
        true,
        null,
        null,
        imagFinal,
        horaFinalFinal,
        horaInicioFinal
      )
      .pipe(switchMap(() => this.apiService.getTodasAreasInformacion()))
      .subscribe(
        (data: Area[]) => {
          for (let area of data) {
            if (
              area.AreaId > this.ultimoId &&
              nombreFinal?.toLowerCase() == area.NombreArea.toLowerCase()
            ) {
              this.ultimoId = area.AreaId;
              this.imageUploadComponent.uploadId = this.ultimoId;
            }
          }
          if (this.ultimoId > -1) {
            this.imageUploadComponent.upload();
          }
        },
        (error) => {
        }
      );
  }

  /* Validar si todos los campos han sido llenados */
  submit() {
    if (this.NuevaAreaForm.valid)
      this.resultado = 'Todos los datos son válidos';
    else this.resultado = 'Hay datos inválidos en el formulario';
  }

  /* Creación del modal*/

  closeResult: string = '';

  constructor(private modalService: NgbModal, private apiService: ApiService) {}

  ngOnInit() {}

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
