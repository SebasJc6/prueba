import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetModificationComponent } from './budget-modification.component';

describe('BudgetModificationComponent', () => {
  let component: BudgetModificationComponent;
  let fixture: ComponentFixture<BudgetModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetModificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
