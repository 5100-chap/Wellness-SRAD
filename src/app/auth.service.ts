import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  // Guarda las direcciones URL, esto permite la redireccion de paginas
  // despues del login
  redirectUrl: string | null = null;

  constructor() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  //Consigue los datos recolectados
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  
  //Guarda la sesion
  public login(
    username: string,
    password: string,
    role: string,
    properties: any
  ) {
    // Se establece las credenciales para el usuario loggeado
    const authenticatedUser = {
      username: username,
      password: password,
      role: role,
      properties: properties,
    };
    sessionStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
    this.currentUserSubject.next(authenticatedUser);
  }

  public logout() {
    // Elimina todo si el usuario hace logout
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
