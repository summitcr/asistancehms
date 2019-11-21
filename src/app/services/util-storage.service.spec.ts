import { TestBed } from '@angular/core/testing';

import { UtilStorageService } from './util-storage.service';

describe('UtilStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilStorageService = TestBed.get(UtilStorageService);
    expect(service).toBeTruthy();
  });
});
