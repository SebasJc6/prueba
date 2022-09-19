import { TestBed } from '@angular/core/testing';

import { BaseInterceptor } from './base.interceptor';

describe('BaseInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BaseInterceptor = TestBed.inject(BaseInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
