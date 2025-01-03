import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListComponent } from '../board';
import { TaskStatus } from '../shared';

@Component({
      standalone: true,
      selector: 'tm-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css'],
      imports: [CommonModule, TaskListComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

      public get todoStatus() {
            return TaskStatus.TODO;
      }

      public get inProgressStatus() {
            return TaskStatus.IN_PROGRESS;
      }

      public get completedStatus() {
            return TaskStatus.COMPLETED;
      }

}
