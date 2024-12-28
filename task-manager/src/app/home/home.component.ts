import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListComponent, TaskListItemComponent } from '../board';

@Component({
      standalone: true,
      selector: 'tm-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css'],
      imports: [CommonModule, TaskListComponent, TaskListItemComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
