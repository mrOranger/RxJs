import { TestBed } from '@angular/core/testing';

import { StoreTaskUserService } from './store-task-user.service';

describe('StoreTaskUserService', () => {
      let service: StoreTaskUserService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(StoreTaskUserService);
      });

      it('should be created', () => {
            expect(service).toBeTruthy();
      });
});
