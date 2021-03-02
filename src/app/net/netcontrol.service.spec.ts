import { TestBed } from '@angular/core/testing';

import { NetcontrolService } from './netcontrol.service';

describe('NetcontrolService', () => {
  let service: NetcontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetcontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
