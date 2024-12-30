import { TestBed } from '@angular/core/testing';

import { NewTaskFormService } from './new-task-form.service';

describe('NewTaskFormService', () => {
      let service: NewTaskFormService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(NewTaskFormService);
      });

      it('should be created', () => {
            expect(service).toBeTruthy();
      });
});
