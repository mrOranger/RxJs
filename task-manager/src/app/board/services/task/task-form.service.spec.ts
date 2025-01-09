import { TestBed } from '@angular/core/testing';

import { TaskFormService } from './task-form.service';

describe('NewTaskFormService', () => {
      let service: TaskFormService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(TaskFormService);
      });

      it('should be created', () => {
            expect(service).toBeTruthy();
      });
});
