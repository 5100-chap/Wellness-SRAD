import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Area } from '../models/area.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-editar-aforo',
  templateUrl: './editar-aforo.component.html',
  styleUrls: ['./editar-aforo.component.css'],
})
export class EditarAforoComponent implements OnInit {
  formGroup!: FormGroup;
  areaActual: Area = new Area();

  title = 'appBootstrap';

  closeResult: string = '';

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
    private apiService: ApiService
  ) { }


    //Validamos que existe el area seleccionada
  private validacionNombre() {
    const nombreAreaParam = this.route.snapshot.paramMap.get('nombreArea');
    if (nombreAreaParam === null) {
      this.router.navigate(['/']);
    } else {
      this.areaActual.NombreArea = nombreAreaParam;
    }
    this.apiService.getAreaByName(this.areaActual.NombreArea).subscribe((response) => {
      this.areaActual = response[0];
      if (
        this.areaActual.NombreArea.toLocaleLowerCase() !==
        nombreAreaParam?.toLocaleLowerCase()
      ) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    const values = this.formGroup.value;
    values.area_id = this.areaActual.AreaId;
    this.apiService.modificarAforoMaximo(
      values.area_id,
      values.nuevo_limite,
      values.esIndefinido,
      values.fechaInicio,
      values.fechaFinal,
      values.descripcion,
    ).subscribe(response => {
      
    });
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
