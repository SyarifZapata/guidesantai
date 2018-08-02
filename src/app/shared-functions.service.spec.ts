import { TestBed, inject } from '@angular/core/testing';

import { SharedFunctionsService } from './shared-functions.service';

describe('SharedFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedFunctionsService]
    });
  });

  it('should be created', inject([SharedFunctionsService], (service: SharedFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
