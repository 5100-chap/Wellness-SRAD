import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const redirectUrl = '/home';
      this.router.navigate([redirectUrl]);
    }
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    const usernameValue = username || '';
    const passwordValue = password || '';
    this.apiService.getXCredentials(usernameValue, passwordValue).pipe(
      tap((data: any) => {
        // Asigna credenciales con las llamadas a la API
        const role = data[1] || '';
        const properties = data[0];
        this.authService.login(usernameValue, passwordValue, role, properties);
        if (role === "Alumno") {
          const redirectUrl = this.authService.redirectUrl ? this.authService.redirectUrl : '/inicio';
          this.router.navigate([redirectUrl]);
        }
        else {
          const redirectUrl = this.authService.redirectUrl ? this.authService.redirectUrl : '/inicioAdmin';
          this.router.navigate([redirectUrl]);
        }
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
        this.router.navigate(['/login'])
      })
    ).subscribe();
  }
}
