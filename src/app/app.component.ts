import { NgClass } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservas } from './models/reservas.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  websiteList: any = ['Javatpoint.com', 'HDTuto.com', 'Tutorialandexample.com'];

  form = new FormGroup({
    website: new FormControl('', Validators.required),
  });

  get f() {
    return this.form.controls;
  }

  submit() { }

  progress: number = 0;
  noOfFiles: number = 13;
  completed: boolean = false;

  public ngOnInit(): void {
    this.updateProgress();
  }

  delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async updateProgress() {
    this.completed = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay(500);
      this.progress = Math.round(i * n);
    }
    this.completed = true;
  }

  title = 'Wellness-SRAD';

  router: string;

  constructor(public _router: Router) {
    this.router = _router.url;
  }
}
