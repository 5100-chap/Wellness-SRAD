import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service'; // actualiza esta ruta al path correcto
import { Area } from '../models/area.model'; // actualiza esta ruta al path correcto

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  title = 'appBootstrap';
  closeResult: string = '';
  areas: Area[] = []; // variable para guardar las áreas
  
  constructor(private modalService: NgbModal, private apiService: ApiService) {}
  
  updateUrl(event: any) {
    event.target.src = '../assets/img/fondo.jpeg';
  }

  ngOnInit(): void {
    this.apiService.getTodasAreasInformacion().subscribe((areas: Area[]) => {
      this.areas = areas;
    }, (error) => {
      console.log(error);
    });
  }
  
  openArea(areaId: number, content:any) {
    this.apiService.updateAreaStatus(areaId, true).subscribe((area: Area) => {
      console.log(area);
      // Actualiza la lista de áreas después de cambiar el estado
      this.ngOnInit();
    }, (error) => {
      console.log(error);
    });
    
    // Abre el modal después de hacer la llamada a la API
    this.open(content);
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
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

