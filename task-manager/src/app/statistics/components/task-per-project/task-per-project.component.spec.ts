import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPerProjectComponent } from './task-per-project.component';

describe('TaskPerProjectComponent', () => {
      let component: TaskPerProjectComponent;
      let fixture: ComponentFixture<TaskPerProjectComponent>;

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [TaskPerProjectComponent],
            });
            fixture = TestBed.createComponent(TaskPerProjectComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it('should create', () => {
            expect(component).toBeTruthy();
      });
});
