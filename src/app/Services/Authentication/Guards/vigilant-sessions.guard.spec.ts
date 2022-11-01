import { TestBed } from '@angular/core/testing';

import { VigilantSessionsGuard } from './vigilant-sessions.guard';

describe('VigilantSessionsGuard', () => {
  let guard: VigilantSessionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VigilantSessionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
