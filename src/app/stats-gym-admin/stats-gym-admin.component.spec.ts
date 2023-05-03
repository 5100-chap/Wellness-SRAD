import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGymAdminComponent } from './stats-gym-admin.component';

describe('StatsGymAdminComponent', () => {
  let component: StatsGymAdminComponent;
  let fixture: ComponentFixture<StatsGymAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsGymAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsGymAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
