import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-task-list',
      templateUrl: './task-list.component.html',
      styleUrls: ['./task-list.component.css'],
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {

      @Input() public title!: string;

}
