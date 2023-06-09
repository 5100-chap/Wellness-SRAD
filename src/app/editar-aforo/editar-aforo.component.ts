import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Area } from '../models/area.model';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editar-aforo',
  templateUrl: './editar-aforo.component.html',
  styleUrls: ['./editar-aforo.component.css'],
})
export class EditarAforoComponent implements OnInit {
   
  //Definición de variables
  formGroup!: FormGroup;
  areaActual: Area = new Area();
  modalBody: string = 'Esperando...';
  today = new Date();

  /** Pipe para darle formato la fecha y hora*/
  pipe = new DatePipe('es');
  changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');

  
  closeResult: string = '';
  modalRef!: any;

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  //Validamos que existe el area seleccionada
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

  isFormValid(): boolean {
    const { esIndefinido, fechaInicio, fechaFinal, nuevo_limite, descripcion } = this.formGroup.value;
  
    if (esIndefinido) {
      // Si es indefinido, las fechas pueden ser nulas.
      return nuevo_limite !== null && descripcion !== null;
    } else {
      // Si no es indefinido, las fechas no pueden ser nulas.
      return fechaInicio !== null && fechaFinal !== null && nuevo_limite !== null && descripcion !== null;
    }
  }
  
  onSubmit(content: any) {
    const values = this.formGroup.value;
    values.area_id = this.areaActual.AreaId;
  
    this.apiService.modificarAforoMaximo(
      values.area_id,
      values.nuevo_limite,
      values.esIndefinido,
      values.fechaInicio,
      values.fechaFinal,
      values.descripcion
    ).subscribe(
      (response) => {
        // Si la llamada a la API es exitosa, este bloque de código se ejecutará
        this.modalBody = 'Aforo actualizado correctamente!';
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

        this.validacionNombre();
        this.areaActual.LugaresTotales = values.nuevo_limite;
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        // Si la llamada a la API resulta en un error, este bloque de código se ejecutará
        const errorMessage = error.message ? error.message : JSON.stringify(error);
        this.modalBody = `Error: ${errorMessage}`;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      }
    );
  }
  
  
  ngOnInit(): void {
    this.validacionNombre();

    this.formGroup = this.formBuilder.group({
      area_id: [null, Validators.required],
      nuevo_limite: [null, Validators.required],
      esIndefinido: [false],
      fechaInicio: [null],
      fechaFinal: [null],
      descripcion: [null],
    });
  }
  /**
   * Write code on Method
   *
   * @return response()
   */

  setModalRef(content: any) {
    this.modalRef = content;
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.modalBody = 'Esperando...';
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
