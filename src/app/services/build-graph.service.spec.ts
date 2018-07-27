import { TestBed, inject } from '@angular/core/testing';

import { BuildGraphService } from './build-graph.service';

describe('BuildGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuildGraphService]
    });
  });

  it('should be created', inject([BuildGraphService], (service: BuildGraphService) => {
    expect(service).toBeTruthy();
  }));
});
