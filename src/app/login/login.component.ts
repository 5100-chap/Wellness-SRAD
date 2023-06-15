import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loading = false;
  hasTried = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      var role = this.authService.currentUserValue.user.role;
      if (role === 'Alumno') {
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
    this.authService.login(username, password).subscribe(() => {
      this.loading = false;
      if (!this.authService.currentUserValue) {
        this.hasTried = true;
      } else {
        var role = this.authService.currentUserValue.user.role;
        if (role === 'Alumno') {
          this.router.navigateByUrl('/inicio');
        } else {
          this.router.navigateByUrl('/inicioAdmin');
        }
      }
    }, error => {
      console.error(error);
      this.loading = false;
      this.hasTried = true;
    });    
  }
}
