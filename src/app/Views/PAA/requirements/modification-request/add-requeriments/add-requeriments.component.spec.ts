import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequerimentsComponent } from './add-requeriments.component';

describe('AddRequerimentsComponent', () => {
  let component: AddRequerimentsComponent;
  let fixture: ComponentFixture<AddRequerimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequerimentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRequerimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
