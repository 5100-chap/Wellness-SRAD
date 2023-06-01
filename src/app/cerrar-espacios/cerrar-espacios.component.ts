import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { Area } from '../models/area.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cerrar-espacios',
  templateUrl: './cerrar-espacios.component.html',
  styleUrls: ['./cerrar-espacios.component.css'],
})
export class CerrarEspaciosComponent implements OnInit {
  formGroup!: FormGroup;
  closeResult: string = '';
  modalBody: string = 'Esperando...';
  areaActual: Area = new Area();
  modalRef!: any;

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
      fechaCierre: [null, Validators.required],
      fechaApertura: [null, Validators.required],
      motivo: [null, Validators.required],
    });
  }

  isFormValid(): boolean {
    const { fechaCierre, fechaApertura, motivo } = this.formGroup.value;

    return fechaCierre !== null && fechaApertura !== null && motivo !== null;
  }

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

  setModalRef(content: any) {
    this.modalRef = content;
  }

  onSubmit(content: any) {
    const { fechaCierre, fechaApertura, motivo } = this.formGroup.value;

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

    console.log(isBefore);

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
  }

  open() {
    this.modalService
      .open(this.modalRef, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

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
