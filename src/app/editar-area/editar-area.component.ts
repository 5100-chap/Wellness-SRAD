import { Component, OnInit, ViewChild} from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Area } from '../models/area.model';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
    selector: 'app-editar-area',
    templateUrl: './editar-area.component.html',
    styleUrls: ['./editar-area.component.css'],
})
export class EditarAreaComponent implements OnInit {
    @ViewChild('imageUploadComponent')
    imageUploadComponent!: ImageUploadComponent;
    //Canmbiar acorde a editar area
    /* Validación de los campos */
    NuevaAreaForm = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descrip: new FormControl('', Validators.required),
        ubicacion: new FormControl('', Validators.required),
        imagen: new FormControl(''),
        horaInicio: new FormControl('', Validators.required),
        horaFinal: new FormControl('', Validators.required),
        material: new FormControl(''),
    });

    areaActual: Area = new Area();

    resultado!: string;
    value!: string;
    today = new Date();

    /** Pipe para darle formato la fecha y hora*/
    pipe = new DatePipe('es');
    changedDate = this.pipe.transform(this.today, 'YYYY-MM-dd');

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
                // Si el área es un gimnasio, deshabilitamos el campo "nombre" del formulario
                if (this.areaActual.NombreArea.toLowerCase() === 'gimnasio') {
                    this.NuevaAreaForm.get('nombre')?.disable();
                    // Asignamos el nombre del gimnasio actual al campo "nombre" del formulario
                    this.NuevaAreaForm.get('nombre')?.setValue(
                        this.areaActual.NombreArea
                    );
                }
            });
    }

    editarArea(
        id: number,
        nombre: string,
        descripcion: string,
        horaInicio: string,
        horaFinal: string,
        ubicacion: string,
        material: string,
        imagen: string
    ) {
        //Verificar si el valor es un String vacío con espacios en blanco
        function blankString(valor: String): boolean {
            return valor.trim() === '';
        }

        var nombreFin: string = blankString(nombre)
            ? this.areaActual.NombreArea
            : nombre;
        var descFin: string = blankString(descripcion)
            ? this.areaActual.Descripcion
            : descripcion;
        var ubiFin: string = blankString(ubicacion)
            ? this.areaActual.Ubicacion
            : ubicacion;
        var matFin: string = blankString(material)
            ? this.areaActual.MaterialDisponible
            : material;

        var imaFin: string = blankString(imagen) ? this.areaActual.Imagen : imagen;
        var horaFinalF: string = blankString(horaFinal)
            ? this.areaActual.horaCierre
            : horaFinal;
        var horaInicioF: string = blankString(horaInicio)
            ? this.areaActual.horaApertura
            : horaInicio;

        this.apiService
            .editArea(
                id,
                nombreFin,
                descFin,
                ubiFin,
                matFin,
                imaFin,
                horaFinalF,
                horaInicioF
            )
            .subscribe(
                (error) => {
                console.log(error);
            }
            );
            this.imageUploadComponent.upload();
    }

    /* Validar si todos los campos han sido llenados */
    submit() {
        if (this.NuevaAreaForm.valid)
            this.resultado = 'Todos los datos son válidos';
        else this.resultado = 'Hay datos inválidos en el formulario';
    }

    /* Creación del modal*/

    closeResult: string = '';

    constructor(
        private modalService: NgbModal,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.validacionNombre();
    }

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
