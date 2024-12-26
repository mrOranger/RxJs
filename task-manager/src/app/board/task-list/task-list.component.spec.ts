import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
      let component: TaskListComponent;
      let fixture: ComponentFixture<TaskListComponent>;

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [TaskListComponent],
            });
            fixture = TestBed.createComponent(TaskListComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it('should create', () => {
            expect(component).toBeTruthy();
      });
});
