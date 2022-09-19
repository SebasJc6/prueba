import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesRequirementComponent } from './properties-requirement.component';

describe('PropertiesRequirementComponent', () => {
  let component: PropertiesRequirementComponent;
  let fixture: ComponentFixture<PropertiesRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesRequirementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
