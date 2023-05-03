import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-id-digital',
  templateUrl: './id-digital.component.html',
  styleUrls: ['./id-digital.component.css'],
})
export class IdDigitalComponent {
  constructor(private authService: AuthService) {}

  get currentUser() {
    return this.authService.currentUserValue;
  }
  get Currentproperties(){
    const obj = this.authService.currentUserValue;
    return obj.properties || {};
  }
}
