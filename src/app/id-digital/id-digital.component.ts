import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-id-digital',
  templateUrl: './id-digital.component.html',
  styleUrls: ['./id-digital.component.css'],
})
export class IdDigitalComponent {
  @ViewChild('barcode', { static: true }) barcodeElement! : ElementRef;

  constructor(private authService: AuthService) {}

  get currentUser() {
    return this.authService.currentUserValue;
  }

  get Currentproperties() {
    const obj = this.authService.currentUserValue;
    return obj.user || {};
  }

  ngAfterViewInit() {
    const barcodeValue = this.currentUser.username;
    JsBarcode(this.barcodeElement.nativeElement, barcodeValue, {
      format: 'CODE128',
      displayValue: true,
      height: 50,
      margin: 10,
    });
  }
}