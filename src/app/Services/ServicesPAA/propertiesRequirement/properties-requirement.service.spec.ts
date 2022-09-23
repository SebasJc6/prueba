import { TestBed } from '@angular/core/testing';

import { PropertiesRequirementService } from './properties-requirement.service';

describe('PropertiesRequirementService', () => {
  let service: PropertiesRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertiesRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
