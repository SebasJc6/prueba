import { TestBed } from '@angular/core/testing';

import { RpService } from './rp.service';

describe('RpService', () => {
  let service: RpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
