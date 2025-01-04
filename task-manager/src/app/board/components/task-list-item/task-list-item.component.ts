import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as moment from 'moment';

import {
      DatabaseService,
      StoreDragTaskService,
      StoreTaskService,
      StoreTaskUserService,
      StoreUserService,
      Task,
      TaskUser,
      TaskUserService,
      User,
      UserService,
} from 'src/app/shared';
import { TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      imports: [CommonModule],
      selector: 'tm-task-list-item',
      templateUrl: './task-list-item.component.html',
      styleUrls: ['./task-list-item.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
            draggable: 'true',
            '(dragstart)': 'onDragStart($event)',
            '(dragend)': 'onDragEnd($event)',
      },
      providers: [
            DatabaseService,
            StoreTaskService,
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: TASK_USER_REPOSITORY_TOKEN, useClass: TaskUserService },
      ],
})
export class TaskListItemComponent implements OnInit {
      @Input() public task!: Task;

      private users!: User[];
      private isHidden: boolean;
      private assignations!: TaskUser[];
      private readonly elementRef: ElementRef;
      private readonly storeUserService: StoreUserService;
      private readonly storeDragTaskService: StoreDragTaskService;
      private readonly storeTaskUserService: StoreTaskUserService;

      public constructor() {
            this.isHidden = false;
            this.elementRef = inject(ElementRef);
            this.storeUserService = inject(StoreUserService);
            this.storeDragTaskService = inject(StoreDragTaskService);
            this.storeTaskUserService = inject(StoreTaskUserService);
      }

      public ngOnInit(): void {
            this.users = this.storeUserService.value;
            this.assignations = this.storeTaskUserService.value;
      }

      public get assignedUsers() {
            return (
                  this.assignations
                        .filter((anAssignation) => anAssignation.taskId === this.task.id)
                        .map((anAssignation) => this.users.find((aUser) => aUser.id === anAssignation.userId)) ?? []
            );
      }

      public get createdAt() {
            return moment(this.task.createdAt).format('ddd, DD/MM/YYYY');
      }

      public get updatedAt() {
            return moment(this.task.updatedAt).format('ddd, DD/MM/YYYY');
      }

      public get hidden() {
            return this.isHidden;
      }

      public onDragStart(event: DragEvent) {
            if (!this.storeDragTaskService.value) {
                  this.storeDragTaskService.value = this.task;
                  console.log(this.task.id, 'dragstart');
            }
      }

      public onDragEnd(event: DragEvent) {
            if (this.storeDragTaskService.value) {
                  this.storeDragTaskService.value = null;
                  console.log(this.task.id, 'dragend');
            }
      }
}
