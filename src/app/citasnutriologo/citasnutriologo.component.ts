import { Component } from '@angular/core';
import { AsesorInfo } from '../models/asesor-info';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citasnutriologo',
  templateUrl: './citasnutriologo.component.html',
  styleUrls: ['./citasnutriologo.component.css']
})
export class CitasnutriologoComponent {
  listaAsesores: AsesorInfo[] = [];
  rol: string = "Nutriologo";

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router){}

  ngOnInit(){
    this.apiService.getAsesoresPorRol(this.rol).subscribe(
      (data: AsesorInfo[])=>{
      this.listaAsesores = data;
    });
  }

  mandarCalendario(asesor: AsesorInfo){
    // this.router.navigate(['horario-asesor/' JSON.stringify(asesor)]);
    this.router.navigate([`horario-asesor/${JSON.stringify(asesor)}`]);
  }
}
