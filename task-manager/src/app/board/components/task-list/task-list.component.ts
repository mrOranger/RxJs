import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { DatabaseService, Task, TaskRepository, TaskService, TaskStatus } from 'src/app/shared';

@Component({
      standalone: true,
      selector: 'tm-task-list',
      templateUrl: './task-list.component.html',
      styleUrls: ['./task-list.component.css'],
      imports: [CommonModule, TaskListItemComponent, NgFor],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
            '(dragenter)': 'onDragEnter($event)',
            '(dragleave)': 'onDragLeave($event)',
            '(dragover)': 'onDragOver($event)',
            '(drop)': 'onDrop($event)',
      },
      providers: [DatabaseService, { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }],
})
export class TaskListComponent implements OnInit {
      @Input() public title!: string;
      @Input() public taskStatus!: TaskStatus;

      private currentTasks: Task[];

      private readonly taskRepository: TaskRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;

      public constructor() {
            this.currentTasks = [];
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.taskRepository.index().subscribe({
                  next: (tasks) => {
                        this.currentTasks = tasks.filter((task) => task.status === this.taskStatus);
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get tasks() {
            return this.currentTasks;
      }

      public onDragEnter(event: DragEvent): void {
            console.log(this.taskStatus, 'onDragEnter', event);
      }

      public onDragOver(event: DragEvent): void {
            event.preventDefault();
            console.log(this.taskStatus, 'onDragOver', event);
      }

      public onDragLeave(event: DragEvent): void {
            console.log(this.taskStatus, 'onDragLeave', event);
      }

      public onDrop(event: DragEvent): void {
            console.log(this.taskStatus, 'onDrop', event);
      }
}
