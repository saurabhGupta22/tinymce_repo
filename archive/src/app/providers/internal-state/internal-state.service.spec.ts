import { TestBed } from '@angular/core/testing';

import { InternalStateService } from './internal-state.service';

describe('InternalStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternalStateService = TestBed.get(InternalStateService);
    expect(service).toBeTruthy();
  });
});
