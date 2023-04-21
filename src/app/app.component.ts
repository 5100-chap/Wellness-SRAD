import { NgClass } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

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
