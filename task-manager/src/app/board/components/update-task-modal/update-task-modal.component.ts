import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { concatMap, forkJoin, Subscription, switchMap, tap } from 'rxjs';

import {
      DatabaseService,
      InputComponent,
      ModalComponent,
      NotificationService,
      SelectComponent,
      StoreSelectedProjectService,
      StoreTaskService,
      Task,
      TaskRepository,
      TaskService,
      TaskUserRepository,
      TaskUserService,
      TextareaComponent,
      User,
      UserRepository,
      UserService,
} from 'src/app/shared';

import { TaskFormService } from '../../services';

import { TASK_REPOSITORY_TOKEN, TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      selector: 'tm-update-task-modal',
      templateUrl: './update-task-modal.component.html',
      styleUrls: ['./update-task-modal.component.css'],
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
export class UpdateTaskModalComponent implements OnInit, OnDestroy {
      @Input() public task!: Task;
      @Input() public modalInstance!: ModalComponent;

      private title!: string;
      private description!: string;
      private assignedUserId!: string;
      private oldAssignedUserId!: string;

      private users?: User[];
      private assignedUser?: User;

      private ok$?: Subscription;
      private cancel$?: Subscription;
      private database$?: Subscription;
      private taskFormService$?: Subscription;

      private readonly taskRepository: TaskRepository;
      private readonly userRepository: UserRepository;
      private readonly taskFormService: TaskFormService;
      private readonly storeTaskService: StoreTaskService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly tasksUserRepository: TaskUserRepository;
      private readonly notificationService: NotificationService;
      private readonly storeSelectedProjectService: StoreSelectedProjectService;

      public constructor() {
            this.taskFormService = inject(TaskFormService);
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.notificationService = inject(NotificationService);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.storeSelectedProjectService = inject(StoreSelectedProjectService);
            this.tasksUserRepository = inject<TaskUserRepository>(TASK_USER_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.taskFormService$ = this.taskFormService.form.valueChanges.subscribe({
                  next: (value) => {
                        this.title = value.title;
                        this.description = value.description;
                        this.assignedUserId = value.assigned_user;
                        this.modalInstance.disableSubmit = !this.taskFormService.form.valid;

                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.database$ = forkJoin([
                  this.userRepository.index(),
                  this.tasksUserRepository.findByTaskId(this.task.id),
            ]).subscribe({
                  next: ([users, assignations]) => {
                        const assignedUserId = assignations[0].userId;

                        this.users = users;
                        this.assignedUser = users.find((aUser) => aUser.id === assignedUserId);
                        this.oldAssignedUserId = this.assignedUser!.id;

                        this.modalInstance.title = 'Update Task';
                        this.taskFormService.titleFormControl.patchValue(this.task.title);
                        this.taskFormService.descriptionFormControl.patchValue(this.task.description);
                        this.taskFormService.assignedUserFormControl.patchValue(this.assignedUser?.id);

                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.ok$ = this.modalInstance.okEvent
                  .pipe(
                        concatMap(() =>
                              this.taskRepository.update(this.task.id, {
                                    title: this.title,
                                    description: this.description,
                                    status: this.task.status,
                                    projectId: this.storeSelectedProjectService.select?.id ?? '',
                              }),
                        ),
                        switchMap(() => this.tasksUserRepository.detach(this.oldAssignedUserId, this.task.id)),
                        switchMap(() => this.tasksUserRepository.attach(this.assignedUserId, this.task.id)),
                  )
                  .subscribe({
                        next: () => {
                              this.storeTaskService.update(this.task, 'id');
                              this.notificationService.success('Task updated successfully');
                              this.changeDetectorRef.detectChanges();
                              this.modalInstance.closeEvent.next();
                        },
                  });

            this.cancel$ = this.modalInstance.closeEvent.subscribe({
                  next: () => this.ngOnDestroy(),
            });
      }

      public get databaseUsers() {
            return this.users ?? [];
      }

      public get form() {
            return this.taskFormService.form;
      }

      public get formService() {
            return this.taskFormService;
      }

      public ngOnDestroy(): void {
            this.ok$?.unsubscribe();
            this.cancel$?.unsubscribe();
            this.database$?.unsubscribe();
            this.taskFormService$?.unsubscribe();
      }
}
