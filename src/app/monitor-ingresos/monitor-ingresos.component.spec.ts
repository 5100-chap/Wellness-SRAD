import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorIngresosComponent } from './monitor-ingresos.component';

describe('MonitorIngresosComponent', () => {
  let component: MonitorIngresosComponent;
  let fixture: ComponentFixture<MonitorIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorIngresosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
