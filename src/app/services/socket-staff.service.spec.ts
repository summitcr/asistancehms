import { TestBed } from '@angular/core/testing';

import { SocketStaffService } from './socket-staff.service';

describe('SocketStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketStaffService = TestBed.get(SocketStaffService);
    expect(service).toBeTruthy();
  });
});
