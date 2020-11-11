import { TestBed } from '@angular/core/testing';

import { AzureRoutesService } from './azure-routes.service';

describe('AzureRoutesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AzureRoutesService = TestBed.get(AzureRoutesService);
    expect(service).toBeTruthy();
  });
});
