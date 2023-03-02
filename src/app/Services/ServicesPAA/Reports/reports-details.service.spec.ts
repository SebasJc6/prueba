import { TestBed } from '@angular/core/testing';

import { ReportsDetailsService } from './reports-details.service';

describe('ReportsDetailsService', () => {
  let service: ReportsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
