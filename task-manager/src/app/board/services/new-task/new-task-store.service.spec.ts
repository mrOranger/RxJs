import { TestBed } from '@angular/core/testing';

import { NewTaskStoreService } from './new-task-store.service';

describe('NewTaskStoreService', () => {
  let service: NewTaskStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewTaskStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
