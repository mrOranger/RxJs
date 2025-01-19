import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from '../basic/basic.component';

import {
      DatabaseService,
      Project,
      ProjectRepository,
      ProjectService,
      Task,
      TaskRepository,
      TaskService,
} from 'src/app/shared';
import { TaskPerProjectComponent } from '../task-per-project/task-per-project.component';
import { PROJECT_REPOSITORY_TOKEN, TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { forkJoin, Subscription } from 'rxjs';
import { TaskStatusComponent } from '../task-status/task-status.component';

@Component({
      standalone: true,
      selector: 'tm-main',
      imports: [CommonModule, BasicComponent, TaskPerProjectComponent, TaskStatusComponent],
      templateUrl: './main.component.html',
      styleUrls: ['./main.component.css'],
})
export class MainComponent {}
