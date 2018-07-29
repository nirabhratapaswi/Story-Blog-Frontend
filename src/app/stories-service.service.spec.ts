import { TestBed, inject } from '@angular/core/testing';

import { StoriesServiceService } from './stories-service.service';

describe('StoriesServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoriesServiceService]
    });
  });

  it('should be created', inject([StoriesServiceService], (service: StoriesServiceService) => {
    expect(service).toBeTruthy();
  }));
});
