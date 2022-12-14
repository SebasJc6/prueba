import { TestBed } from '@angular/core/testing';

import { StockOrdersService } from './stock-orders.service';

describe('StockOrdersService', () => {
  let service: StockOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
