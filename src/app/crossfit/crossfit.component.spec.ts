import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossfitComponent } from './crossfit.component';

describe('CrossfitComponent', () => {
  let component: CrossfitComponent;
  let fixture: ComponentFixture<CrossfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossfitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
