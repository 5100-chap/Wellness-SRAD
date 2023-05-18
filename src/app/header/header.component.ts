import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
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

  isAlumno() {
    const obj = this.authService.currentUserValue;
    return obj.role === 'Alumno';
  }

  isAdmin() {
    const obj = this.authService.currentUserValue;
    return obj.role === 'Administrador';
  }


  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
