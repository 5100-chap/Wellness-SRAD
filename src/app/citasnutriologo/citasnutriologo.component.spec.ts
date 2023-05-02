import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasnutriologoComponent } from './citasnutriologo.component';

describe('CitasnutriologoComponent', () => {
  let component: CitasnutriologoComponent;
  let fixture: ComponentFixture<CitasnutriologoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitasnutriologoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasnutriologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
