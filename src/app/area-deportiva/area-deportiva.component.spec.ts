import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDeportivaComponent } from './area-deportiva.component';

describe('AreaDeportivaComponent', () => {
  let component: AreaDeportivaComponent;
  let fixture: ComponentFixture<AreaDeportivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaDeportivaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaDeportivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
