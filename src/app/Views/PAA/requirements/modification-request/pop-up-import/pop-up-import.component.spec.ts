import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpImportComponent } from './pop-up-import.component';

describe('PopUpImportComponent', () => {
  let component: PopUpImportComponent;
  let fixture: ComponentFixture<PopUpImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
