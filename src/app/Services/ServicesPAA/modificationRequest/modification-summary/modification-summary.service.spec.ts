import { TestBed } from '@angular/core/testing';

import { ModificationSummaryService } from './modification-summary.service';

describe('ModificationSummaryService', () => {
  let service: ModificationSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModificationSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
