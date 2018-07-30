import { TestBed, inject } from '@angular/core/testing';

import { WritersService } from './writers.service';

describe('WritersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WritersService]
    });
  });

  it('should be created', inject([WritersService], (service: WritersService) => {
    expect(service).toBeTruthy();
  }));
});
