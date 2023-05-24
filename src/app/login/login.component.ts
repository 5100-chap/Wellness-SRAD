import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loading = false;
  hasTried = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      var role = this.authService.currentUserValue;
      if (role.role === 'Alumno') {
        this.router.navigateByUrl('/inicio');
      } else {
        this.router.navigateByUrl('/inicioAdmin');
      }
    }
    localStorage.setItem('opcion', 'T');
  }

  onSubmit() {
    this.loading = true;
    const { username, password } = this.loginForm.value;
    const usernameValue = username || '';
    const passwordValue = password || '';
    this.apiService.getXCredentials(usernameValue, passwordValue).pipe(
      tap((data: any) => {
        // Asigna credenciales con las llamadas a la API
        const role = data[0].role || '';
        const properties = data[0];
        this.authService.login(usernameValue, passwordValue, role, properties);
        if (role === 'Alumno') {
          const redirectUrl = this.authService.redirectUrl
            ? this.authService.redirectUrl
            : '/inicio';
          this.router.navigate([redirectUrl]);
        } else {
          const redirectUrl = this.authService.redirectUrl
            ? this.authService.redirectUrl
            : '/inicioAdmin';
          this.router.navigate([redirectUrl]);
        }
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    ).subscribe(() => {
      this.loading = false;
      if (!this.authService.currentUserValue) {
        this.hasTried = true;
      }
    });
  }
}
