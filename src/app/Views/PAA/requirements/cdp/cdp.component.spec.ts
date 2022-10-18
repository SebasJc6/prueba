import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDPComponent } from './cdp.component';

describe('CDPComponent', () => {
  let component: CDPComponent;
  let fixture: ComponentFixture<CDPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
