import { TestBed } from '@angular/core/testing';

import { CounterpartService } from './counterpart.service';

describe('CounterpartService', () => {
  let service: CounterpartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterpartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
