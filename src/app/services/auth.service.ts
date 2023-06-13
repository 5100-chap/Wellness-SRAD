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
        const authenticatedUser = {
          token: response.token,
          user: response.user
        };
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
}
