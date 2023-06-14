import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { LoginResponse } from '../models/loginResponse.model';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private loggedIn = false;
  redirectUrl: string | null = null;

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {
    // Inyecta el servicio API
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const currentUser = JSON.parse(userJson);
      const currentToken = this.tokenService.currentTokenValue;
      if (currentToken && !this.tokenService.isTokenExpired(currentToken)) {
        this.currentUserSubject.next(currentUser);
        this.loggedIn = true;
      } else {
        this.logout();
      }
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public login(username: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.apiService.login(username, password).subscribe(
        (response: LoginResponse) => {
          const preAuth = new LoginResponse(response.token, response.user);
          // Se establece las credenciales para el usuario loggeado
          const authenticatedUser = {
            username: username,
            role: preAuth.user.role,
            user: preAuth.user
          };
          // Cuando recibes el token del backend, lo almacenas así:
          this.tokenService.updateToken(preAuth.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify(authenticatedUser)
          );

          this.currentUserSubject.next(authenticatedUser);
          this.loggedIn = true;
          observer.next(authenticatedUser);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  public logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedIn = false;
    this.tokenService.clearToken();
  }

  public isLoggedIn() {
    return this.loggedIn;
  }

  // Actualizar el token del usuario actual
  public updateCurrentUserToken(newToken: string) {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      currentUser.token = newToken;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.currentUserSubject.next(currentUser);
    }
  }
}
