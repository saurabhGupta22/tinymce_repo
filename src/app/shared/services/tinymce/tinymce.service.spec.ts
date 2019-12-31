import { TestBed } from '@angular/core/testing';

import { TinymceService } from './tinymce.service';

describe('TinymceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TinymceService = TestBed.get(TinymceService);
    expect(service).toBeTruthy();
  });
});
