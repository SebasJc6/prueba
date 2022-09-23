import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsPopUpComponent } from './alerts-pop-up.component';

describe('AlertsPopUpComponent', () => {
  let component: AlertsPopUpComponent;
  let fixture: ComponentFixture<AlertsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
