import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTrayComponent } from './request-tray.component';

describe('RequestTrayComponent', () => {
  let component: RequestTrayComponent;
  let fixture: ComponentFixture<RequestTrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
