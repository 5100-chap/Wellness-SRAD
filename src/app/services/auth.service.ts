import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service'; 
import { LoginResponse } from '../models/loginResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})



export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private loggedIn = false;
  redirectUrl: string | null = null;

  constructor(private apiService: ApiService) { // Inyecta el servicio API
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
      this.loggedIn = true;
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  
  public login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.apiService.login(username, password).subscribe((response: LoginResponse) => {
        const authenticatedUser = new LoginResponse(response.token, response.user);
        sessionStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        this.currentUserSubject.next(authenticatedUser);
        this.loggedIn = true;
        observer.next(authenticatedUser);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  public logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedIn = false;
  }

  public isLoggedIn(){
    return this.loggedIn;
  }

    // Actualizar el token del usuario actual
    public updateCurrentUserToken(newToken: string) {
      const currentUser = this.currentUserValue;
      if (currentUser) {
        currentUser.token = newToken;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
      }
    }
}
