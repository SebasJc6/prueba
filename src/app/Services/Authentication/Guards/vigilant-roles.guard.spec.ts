import { TestBed } from '@angular/core/testing';

import { VigilantRolesGuard } from './vigilant-roles.guard';

describe('VigilantRolesGuard', () => {
  let guard: VigilantRolesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VigilantRolesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
