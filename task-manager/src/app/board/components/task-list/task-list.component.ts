import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import {
      DatabaseService,
      StoreDragTaskService,
      StoreSelectedProjectService,
      StoreTaskService,
      Task,
      TaskRepository,
      TaskService,
      TaskStatus,
} from 'src/app/shared';
import { combineLatest, Subscription } from 'rxjs';

@Component({
      standalone: true,
      selector: 'tm-task-list',
      templateUrl: './task-list.component.html',
      styleUrls: ['./task-list.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CommonModule, TaskListItemComponent, NgFor],
      host: {
            '[class.dragover]': 'isDraggingOver',
            '(drop)': 'onDrop()',
            '(dragover)': 'onDragOver($event)',
            '(dragenter)': 'onDragEnter()',
      },
      providers: [DatabaseService, { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }],
})
export class TaskListComponent implements OnInit, OnDestroy {
      @Input() public title!: string;
      @Input() public taskStatus!: TaskStatus;

      private currentTasks!: Task[];

      private readonly taskRepository: TaskRepository;
      private readonly storeTaskService: StoreTaskService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly storeDragTaskService: StoreDragTaskService;
      private readonly selectedProjectService: StoreSelectedProjectService;

      private data$!: Subscription;

      public constructor() {
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.storeDragTaskService = inject(StoreDragTaskService);
            this.selectedProjectService = inject(StoreSelectedProjectService);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.data$ = combineLatest([
                  this.storeTaskService.subject$,
                  this.selectedProjectService.subject$,
            ]).subscribe({
                  next: ([tasks, selectedProject]) => {
                        if (selectedProject?.id) {
                              this.currentTasks = tasks.filter((aTask) => aTask.status === this.taskStatus);
                              this.changeDetectorRef.detectChanges();
                        }
                  },
            });
      }

      public get tasks() {
            return this.currentTasks ?? [];
      }

      public get isDraggingOver() {
            return this.storeDragTaskService.value?.status === this.taskStatus;
      }

      public onDragEnter(): void {
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

      public onDrop(): void {
            if (this.storeDragTaskService.value) {
                  const draggedTask = this.storeDragTaskService.value;
                  this.taskRepository.update(draggedTask.id, draggedTask);
                  this.storeDragTaskService.value = null;
            }
      }

      public ngOnDestroy(): void {
            this.data$.unsubscribe();
      }
}
