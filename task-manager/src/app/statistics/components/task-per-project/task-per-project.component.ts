import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';

import { Chart } from 'chart.js';
import { forkJoin, Subscription } from 'rxjs';

import {
      DatabaseService,
      Project,
      ProjectRepository,
      ProjectService,
      Task,
      TaskRepository,
      TaskService,
} from 'src/app/shared';
import { PROJECT_REPOSITORY_TOKEN, TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      selector: 'tm-task-per-project',
      imports: [CommonModule, NgChartsModule],
      templateUrl: './task-per-project.component.html',
      styleUrls: ['./task-per-project.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            DatabaseService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
            { provide: PROJECT_REPOSITORY_TOKEN, useClass: ProjectService },
      ],
})
export class TaskPerProjectComponent implements OnInit, OnDestroy {
      public chart!: Chart;

      private readonly taskRepository: TaskRepository;
      private readonly projectRepository: ProjectRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;

      private data$!: Subscription;

      private tasks!: Task[];
      private projects!: Project[];

      public constructor() {
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.projectRepository = inject<ProjectRepository>(PROJECT_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.data$ = forkJoin([this.taskRepository.index(), this.projectRepository.index()]).subscribe({
                  next: ([tasks, projects]) => {
                        this.tasks = tasks;
                        this.projects = projects;
                        this.chart.data.labels = this.labels;
                        this.chart.data.datasets[0].data = this.tasksPerProject;
                        this.chart.update();
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.chart = new Chart('task-per-project', {
                  type: 'bar',
                  data: {
                        labels: [],
                        datasets: [
                              {
                                    label: 'Tasks',
                                    data: [],
                                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                                    borderColor: ['rgba(255, 99, 132, 1)'],
                                    borderWidth: 1,
                              },
                        ],
                  },
            });
      }

      public get labels() {
            return this.projects?.map((project) => project.title) ?? [];
      }

      public get tasksPerProject() {
            return this.labels
                  .map((aProjectTitle) => this.projects.find((aProject) => aProject.title === aProjectTitle))
                  .map((aProject) => this.tasks.filter((aTask) => aTask.projectId === aProject?.id))
                  .map((aTaskLists) => aTaskLists.length);
      }

      public ngOnDestroy(): void {
            this.data$.unsubscribe();
      }
}
