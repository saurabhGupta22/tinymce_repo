import { TestBed } from '@angular/core/testing';

import { TinymceSService } from './tinymce-s.service';

describe('TinymceSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TinymceSService = TestBed.get(TinymceSService);
    expect(service).toBeTruthy();
  });
});
