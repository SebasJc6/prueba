import { TestBed } from '@angular/core/testing';

import { RequerimentService } from './requeriment.service';

describe('RequerimentService', () => {
  let service: RequerimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequerimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
