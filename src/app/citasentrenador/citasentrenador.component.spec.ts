import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasentrenadorComponent } from './citasentrenador.component';

describe('CitasentrenadorComponent', () => {
  let component: CitasentrenadorComponent;
  let fixture: ComponentFixture<CitasentrenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitasentrenadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasentrenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
