import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationSummaryComponent } from './modification-summary.component';

describe('ModificationSummaryComponent', () => {
  let component: ModificationSummaryComponent;
  let fixture: ComponentFixture<ModificationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
