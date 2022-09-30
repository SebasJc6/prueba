import { TestBed } from '@angular/core/testing';

import { TaskTrayService } from './task-tray.service';

describe('TaskTrayService', () => {
  let service: TaskTrayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTrayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
