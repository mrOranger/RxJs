import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { DatabaseService, StoreTaskService, TaskRepository, TaskService, TaskStatus } from '../shared';
import { TASK_REPOSITORY_TOKEN } from '../injection-tokens';
import { TaskListComponent } from '../board';

@Component({
      standalone: true,
      selector: 'tm-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css'],
      imports: [CommonModule, TaskListComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [DatabaseService, { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }],
})
export class HomeComponent implements OnInit, OnDestroy {
      private taskRepository$!: Subscription;
      private readonly taskRepository: TaskRepository;
      private readonly storeTaskService: StoreTaskService;
      private readonly changeDetectorRef: ChangeDetectorRef;

      public constructor() {
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.taskRepository$ = this.taskRepository.index().subscribe({
                  next: (tasks) => {
                        this.storeTaskService.value = tasks;
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get todoStatus() {
            return TaskStatus.TODO;
      }

      public get inProgressStatus() {
            return TaskStatus.IN_PROGRESS;
      }

      public get completedStatus() {
            return TaskStatus.COMPLETED;
      }

      public ngOnDestroy(): void {
            this.taskRepository$.unsubscribe();
      }
}
