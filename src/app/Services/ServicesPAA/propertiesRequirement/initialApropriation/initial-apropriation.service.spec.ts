import { TestBed } from '@angular/core/testing';

import { InitialApropriationService } from './initial-apropriation.service';

describe('InitialApropriationService', () => {
  let service: InitialApropriationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialApropriationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
