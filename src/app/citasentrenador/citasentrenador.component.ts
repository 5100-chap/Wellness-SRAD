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
  listaAsesores: AsesorInfo[] = [];
  rol: string = "Entrenador";

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
