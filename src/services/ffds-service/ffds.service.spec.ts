import { TestBed } from '@angular/core/testing';

import { FfdsService } from './ffds.service';

describe('FfdsService', () => {
  let service: FfdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
