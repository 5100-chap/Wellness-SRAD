import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdDigitalComponent } from './id-digital.component';

describe('IdDigitalComponent', () => {
  let component: IdDigitalComponent;
  let fixture: ComponentFixture<IdDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdDigitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
