import { TestBed } from '@angular/core/testing';

import { RequestTrayService } from './request-tray.service';

describe('RequestTrayService', () => {
  let service: RequestTrayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTrayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
