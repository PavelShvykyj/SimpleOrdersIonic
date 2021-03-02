import { TestBed } from '@angular/core/testing';

import { Onec.ConnectorService } from './onec.connector.service';

describe('Onec.ConnectorService', () => {
  let service: Onec.ConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Onec.ConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
