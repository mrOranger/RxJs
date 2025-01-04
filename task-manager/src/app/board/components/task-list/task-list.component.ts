import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import {
      DatabaseService,
      StoreDragTaskService,
      StoreTaskService,
      Task,
      TaskRepository,
      TaskService,
      TaskStatus,
} from 'src/app/shared';
import { Subscription } from 'rxjs';

@Component({
      standalone: true,
      selector: 'tm-task-list',
      templateUrl: './task-list.component.html',
      styleUrls: ['./task-list.component.css'],
      imports: [CommonModule, TaskListItemComponent, NgFor],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
            '(drop)': 'onDrop($event)',
            '(dragover)': 'onDragOver($event)',
            '(dragenter)': 'onDragEnter($event)',
            '(dragleave)': 'onDragLeave($event)',
      },
      providers: [DatabaseService, { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }],
})
export class TaskListComponent implements OnInit, OnDestroy {
      @Input() public title!: string;
      @Input() public taskStatus!: TaskStatus;

      private currentTasks: Task[];

      private readonly taskRepository: TaskRepository;
      private readonly storeTaskService: StoreTaskService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly storeDragTaskService: StoreDragTaskService;

      private storeTaskService$!: Subscription;

      public constructor() {
            this.currentTasks = [];
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.storeDragTaskService = inject(StoreDragTaskService);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.storeTaskService$ = this.storeTaskService.subscribe({
                  next: (tasks) => {
                        this.currentTasks = tasks.filter((aTask) => aTask.status === this.taskStatus);
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get tasks() {
            return this.currentTasks;
      }

      public onDragEnter(event: DragEvent): void {
            if (this.storeDragTaskService.value) {
                  const draggedTask = this.storeDragTaskService.value;
                  draggedTask.status = this.taskStatus;
                  this.storeTaskService.update(draggedTask, 'id');
            }
      }

      public onDragOver(event: DragEvent): void {
            if (this.storeDragTaskService.value) {
                  event.preventDefault();
            }
      }

      public onDragLeave(event: DragEvent): void {}

      public onDrop(event: DragEvent): void {
            if (this.storeDragTaskService.value) {
                  const draggedTask = this.storeDragTaskService.value;
                  this.taskRepository.update(draggedTask.id, draggedTask);
                  this.storeDragTaskService.value = null;
            }
      }

      public ngOnDestroy(): void {
            this.storeTaskService$.unsubscribe();
      }
}
