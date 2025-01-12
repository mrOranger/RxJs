import { TestBed } from '@angular/core/testing';

import { ProjectFormService } from './project-form.service';

describe('ProjectFormService', () => {
      let service: ProjectFormService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(ProjectFormService);
      });

      it('should be created', () => {
            expect(service).toBeTruthy();
      });
});
