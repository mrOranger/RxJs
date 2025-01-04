import { TestBed } from '@angular/core/testing';

import { TaskListService } from './store-task-list.service';

describe('TaskListService', () => {
      let service: TaskListService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(TaskListService);
      });

      it('should be created', () => {
            expect(service).toBeTruthy();
      });
});
