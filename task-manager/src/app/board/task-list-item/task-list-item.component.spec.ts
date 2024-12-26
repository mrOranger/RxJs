import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListItemComponent } from './task-list-item.component';

describe('TaskListItemComponent', () => {
      let component: TaskListItemComponent;
      let fixture: ComponentFixture<TaskListItemComponent>;

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [TaskListItemComponent],
            });
            fixture = TestBed.createComponent(TaskListItemComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it('should create', () => {
            expect(component).toBeTruthy();
      });
});
