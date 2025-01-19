import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as moment from 'moment';

import {
      DatabaseService,
      ModalService,
      StoreDragTaskService,
      StoreTaskService,
      StoreTaskUpdateService,
      StoreTaskUserService,
      StoreUserService,
      Task,
      TaskUser,
      TaskUserService,
      User,
      UserService,
} from 'src/app/shared';
import { TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { UpdateTaskModalComponent } from '../update-task-modal/update-task-modal.component';

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
            '(click)': 'onUpdateTask()',
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
      private readonly modalService: ModalService;
      private readonly storeUserService: StoreUserService;
      private readonly storeDragTaskService: StoreDragTaskService;
      private readonly storeTaskUserService: StoreTaskUserService;
      private readonly storeTaskUpdateService: StoreTaskUpdateService;

      public constructor() {
            this.isHidden = false;
            this.modalService = inject(ModalService);
            this.storeUserService = inject(StoreUserService);
            this.storeDragTaskService = inject(StoreDragTaskService);
            this.storeTaskUserService = inject(StoreTaskUserService);
            this.storeTaskUpdateService = inject(StoreTaskUpdateService);
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
            }
      }

      public onDragEnd(event: DragEvent) {
            if (this.storeDragTaskService.value) {
                  this.storeDragTaskService.value = null;
            }
      }

      public onUpdateTask() {
            this.storeTaskUpdateService.value = this.task;
            this.modalService.create({
                  component: UpdateTaskModalComponent,
                  params: {
                        task: this.task,
                  },
                  title: 'Update task',
                  width: '60%',
                  closeDisabled: false,
                  submitDisabled: true,
            });
      }
}
