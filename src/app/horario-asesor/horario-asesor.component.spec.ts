import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioAsesorComponent } from './horario-asesor.component';

describe('HorarioAsesorComponent', () => {
  let component: HorarioAsesorComponent;
  let fixture: ComponentFixture<HorarioAsesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioAsesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioAsesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
