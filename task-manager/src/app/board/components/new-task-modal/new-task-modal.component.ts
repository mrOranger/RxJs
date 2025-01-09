import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
      TaskService,
      UserService,
      InputComponent,
      TaskUserService,
      SelectComponent,
      DatabaseService,
      NotificationService,
      TextareaComponent,
      ModalComponent,
} from 'src/app/shared';
import { TASK_REPOSITORY_TOKEN, TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { TaskFormService } from '../../services';

@Component({
      standalone: true,
      selector: 'tm-new-task-modal',
      templateUrl: './new-task-modal.component.html',
      styleUrls: ['./new-task-modal.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            DatabaseService,
            TaskFormService,
            NotificationService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: TASK_USER_REPOSITORY_TOKEN, useClass: TaskUserService },
      ],
      imports: [FormsModule, ReactiveFormsModule, InputComponent, SelectComponent, TextareaComponent],
})
export class NewTaskModalComponent implements OnInit, OnDestroy {
      @Input() public modalInstance!: ModalComponent;
      private readonly taskFormService: TaskFormService;

      public constructor() {
            this.taskFormService = inject(TaskFormService);
      }

      public ngOnInit(): void {
            this.modalInstance.title = 'New Task';
      }

      public get users() {
            return [];
      }

      public get form() {
            return this.taskFormService.form;
      }

      public get formService() {
            return this.taskFormService;
      }

      public ngOnDestroy(): void {}
}
