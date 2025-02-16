import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, Colors } from 'chart.js';

import { Subscription } from 'rxjs';

import { DatabaseService, Task, TaskRepository, TaskService, TaskStatus } from 'src/app/shared';
import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { baseColors } from 'ng2-charts';

@Component({
      standalone: true,
      selector: 'tm-task-status',
      imports: [CommonModule],
      templateUrl: './task-status.component.html',
      styleUrls: ['./task-status.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [DatabaseService, { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }],
})
export class TaskStatusComponent implements OnInit, OnDestroy {
      public chart!: Chart;

      private readonly taskRepository: TaskRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;

      private tasks$!: Subscription;

      private tasks!: Task[];

      public constructor() {
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.tasks$ = this.taskRepository.index().subscribe({
                  next: (tasks) => {
                        this.tasks = tasks;
                        this.chart.data.labels = this.labels;
                        this.chart.data.datasets[0].data = this.tasksStatuses;
                        this.chart.update();
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.chart = new Chart('task-status', {
                  type: 'bar',
                  data: {
                        labels: [],
                        datasets: [
                              {
                                    label: 'Tasks',
                                    data: [],
                                    backgroundColor: ['#f0e2e7', '#3f84e5', '#3f784c'],
                                    borderColor: ['#c4c4c4', '#c4c4c4', '#c4c4c4'],
                                    borderWidth: 1,
                              },
                        ],
                  },
            });
      }

      public get labels() {
            return [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];
      }

      public get tasksStatuses() {
            return this.labels
                  .map((aStatus) => this.tasks.filter((aTask) => aTask.status === aStatus))
                  .map((aTaskList) => aTaskList.length);
      }

      public ngOnDestroy(): void {
            this.tasks$.unsubscribe();
      }
}
