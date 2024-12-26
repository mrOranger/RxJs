import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-task-list-item',
      templateUrl: './task-list-item.component.html',
      styleUrls: ['./task-list-item.component.css'],
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListItemComponent {}
