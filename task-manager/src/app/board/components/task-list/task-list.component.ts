import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { DatabaseService, Task, TaskRepository, TaskService } from 'src/app/shared';
import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { Observable } from 'rxjs';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';

@Component({
      standalone: true,
      selector: 'tm-task-list',
      templateUrl: './task-list.component.html',
      styleUrls: ['./task-list.component.css'],
      imports: [CommonModule, TaskListItemComponent, NgFor],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{ provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }, DatabaseService],
})
export class TaskListComponent {
      @Input() public title!: string;

      private readonly _tasks: Observable<Task[]>;

      public constructor(@Inject(TASK_REPOSITORY_TOKEN) private readonly taskRepository: TaskRepository) {
            this._tasks = this.taskRepository.index();
      }

      public get tasks$() {
            return this._tasks;
      }
}
