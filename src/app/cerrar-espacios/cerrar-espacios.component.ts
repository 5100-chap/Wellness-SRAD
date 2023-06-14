import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { Area } from '../models/area.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-cerrar-espacios',
  templateUrl: './cerrar-espacios.component.html',
  styleUrls: ['./cerrar-espacios.component.css'],
})
export class CerrarEspaciosComponent implements OnInit {

  //Definición de variables
  formGroup!: FormGroup;
  closeResult: string = '';
  modalBody: string = 'Esperando...';
  areaActual: Area = new Area();
  modalRef!: any;
  today = new Date();

  /** Pipe para darle formato la fecha y hora*/
  pipe = new DatePipe('es');
  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');


  //Definición del constructor
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.validacionNombre();
    this.formGroup = this.formBuilder.group({
      fechaCierre: [null , Validators.required],
      fechaApertura: [null , Validators.required],
      motivo: [null , Validators.required],
    });
  }


  //Métod para saber si el formulario no tiene campos vacios
  isFormValid(): boolean {
    const { fechaCierre, fechaApertura, motivo } = this.formGroup.value;

    return fechaCierre !== null && fechaApertura !== null && motivo !== null;
  }

  //Método para validar el nombre del área deportiva
  private validacionNombre() {
    const nombreAreaParam = this.route.snapshot.paramMap.get('nombreArea');
    if (nombreAreaParam === null) {
      this.router.navigate(['/']);
    } else {
      this.areaActual.NombreArea = nombreAreaParam;
    }
    this.apiService
      .getAreaByName(this.areaActual.NombreArea)
      .subscribe((response) => {
        this.areaActual = response[0];
        if (
          this.areaActual.NombreArea.toLocaleLowerCase() !==
          nombreAreaParam?.toLocaleLowerCase()
        ) {
          this.router.navigate(['/']);
        }
      });
  }


 //Método para definir el contenido del modal
  setModalRef(content: any) {
    this.modalRef = content;
  }

  onSubmit(content: any) {
    const { fechaCierre, fechaApertura, motivo } = this.formGroup.value;

    //Validación de fechas para evitar que la fecha final sea menor que la fecha inicial
    const fecha1D: Date = new Date(fechaCierre);
    const fecha2D: Date = new Date(fechaApertura);
    const diferenciaEnMilisegundosD: number = fecha2D.getTime() - fecha1D.getTime();
    const diferenciaEnDiasD: number = Math.floor(diferenciaEnMilisegundosD / (1000 * 60 * 60 * 24));


    if(diferenciaEnDiasD > 0){
       //Definición de variables para la creación del anuncio
    const nombreAreaParam = this.route.snapshot.paramMap.get('nombreArea');

    const titulo = "Cierre del área deportiva de " + nombreAreaParam

    // Crear un objeto de la fecha actual
    const currentDate = new Date();

    //Crea un objeto de la fecha de apertura del formulario
    let partsApertura = fechaApertura.split("-");
    let aperturaDate = new Date(+partsApertura[0], +partsApertura[1] - 1, +partsApertura[2]); // crear la fecha sin aplicar el cambio de zona horaria

    // Crear un objeto de la fecha de cierre del formulario
    let partsCierre = fechaCierre.split("-");
    let cierreDate = new Date(+partsCierre[0], +partsCierre[1] - 1, +partsCierre[2]); // crear la fecha sin aplicar el cambio de zona horaria
    // Comparar las fechas
    const isBefore = currentDate < cierreDate;

    if (isBefore) {
      // Si la fecha actual es antes de la fecha de cierre
      this.modalBody = 'El cierre se ha programado correctamente!';
    } else {
      // Si la fecha actual es después de la fecha de cierre
      this.modalBody = 'Área cerrada correctamente!';
    }
    
    //Creación del anuncio para notificar el cierre del área deportiva
    this.apiService
    .createAnuncio(
      fechaCierre,
      fechaApertura,
      nombreAreaParam,
      motivo,
      fechaCierre,
      fechaApertura,
      'https://tec.mx/sites/default/files/styles/share/public/2020-09/logotipo-borregos-tec-de-monterrey_0.jpg?itok=_VNOFmiK',
      titulo
    )
    .subscribe((error) => {
      console.log(error);
    });

    return new Promise((resolve, reject) => {
      this.apiService
        .updateAreaClose(this.areaActual.AreaId, cierreDate, aperturaDate)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    })
      .then((response) => {
        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
        });

        this.validacionNombre();
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.modalBody = 'Ocurrió un error al intentar cerrar el área!';
        this.open();
      });

    } else {
      this.modalBody = 'Las fechas de duración del cierre del área deportiva no son válidas. \n Ingrese nuevas fechas';
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
    return 0

  }



//Actualizar la ventana actual
refresh() {
  window.location.reload();
}


//Método para abrir el modal
  open() {
    this.modalService
      .open(this.modalRef, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if(this.modalBody == "El cierre se ha programado correctamente!" || this.modalBody == "Área cerrada correctamente!"){
            this.refresh()
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          if(this.modalBody == "El cierre se ha programado correctamente!" || this.modalBody == "Área cerrada correctamente!"){
            this.refresh()
          }
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      if(this.modalBody == "El cierre se ha programado correctamente!" || this.modalBody == "Área cerrada correctamente!"){
        this.refresh()
      }
      return 'by pressing ESC';
      
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      if(this.modalBody == "El cierre se ha programado correctamente!" || this.modalBody == "Área cerrada correctamente!"){
        this.refresh()
      }
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
