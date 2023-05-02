import { NgClass } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservas } from './models/reservas';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
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
      console.log(i);
    }
    this.completed = true;
  }




  title = 'Wellness-SRAD';

  router: string;

  constructor(public _router: Router) {
    this.router = _router.url;
  }
}


