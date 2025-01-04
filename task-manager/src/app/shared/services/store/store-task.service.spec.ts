import { TestBed } from '@angular/core/testing';
import { StoreTaskService } from './store-task.service';

describe('TaskListService', () => {
      let service: StoreTaskService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(StoreTaskService);
      });

      it('should be created', () => {
            expect(service).toBeTruthy();
      });
});
