import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTrayComponent } from './task-tray.component';

describe('TaskTrayComponent', () => {
  let component: TaskTrayComponent;
  let fixture: ComponentFixture<TaskTrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
