import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService,  private router: Router) { }
  ngOnInit() {
  }

  //Función para saber si el usuario es un alumno

  isAlumno() {
    const obj = this.authService.currentUserValue;
    return obj.role === 'Alumno';
  }

  //Función para saber si el usuario es un administrador 
  isAdmin(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Administrador' ;
  }

  //Función para saber si el usuario es un asesor
  isInstructor(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Instructor' ;
  }

   //Función para saber si el usuario es un asesor
   isDirector(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Director' ;
  }


  //Función para saber si el usuario es un administrador o un alumno
  isAdminOrAlumno(){
    const obj = this.authService.currentUserValue;
    return obj.role === 'Administrador' ||  obj.role === 'Alumno';

  }

  //Función para cerrar sesión y borrar credenciales
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
