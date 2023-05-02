import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarEspaciosComponent } from './cerrar-espacios.component';

describe('CerrarEspaciosComponent', () => {
  let component: CerrarEspaciosComponent;
  let fixture: ComponentFixture<CerrarEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CerrarEspaciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
