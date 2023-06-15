import { 
  Component,
  OnInit 
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { AsesorInfo } from '../models/asesor-info';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-citasentrenador',
  templateUrl: './citasentrenador.component.html',
  styleUrls: ['./citasentrenador.component.css']
})
export class CitasentrenadorComponent {

  //Definición de las variables a utilizar
  listaAsesores: AsesorInfo[] = [];
  rol: string = "Entrenador";
 
  //Definición del constructor
  constructor(private apiService: ApiService, private authService: AuthService, private router: Router){}

  //Redirige al alumno al calendario de reservación del entrenador seleccionado
  mandarCalendario(asesor: AsesorInfo){
    this.router.navigate([`horario-asesor/${JSON.stringify(asesor)}`]);
  }

  // Método para obtener la información de los entrenadores disponibles
  obtnerInfoEntrenadores(){
    this.apiService.getAsesoresPorRol(this.rol).subscribe(
      (data: AsesorInfo[])=>{
      this.listaAsesores = data;
    });
  }
  


  ngOnInit(){
    this.obtnerInfoEntrenadores()

  }

  
}
