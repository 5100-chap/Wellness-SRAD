import { NgClass } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Reservas } from './models/reservas';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Wellness-SRAD';

  router: string;

  constructor(public _router: Router) {
    this.router = _router.url;
  }
}


