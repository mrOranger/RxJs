import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
      TaskRepository,
      UserRepository,
      User,
      TaskStatus,
      TaskUserRepository,
      StoreTaskService,
} from 'src/app/shared';
import { TASK_REPOSITORY_TOKEN, TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { TaskFormService } from '../../services';
import { concatMap, mergeMap, Subscription, switchMap, tap } from 'rxjs';

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

      private users!: User[];
      private title!: string;
      private description!: string;
      private assignedUserId!: string;

      private readonly userRepository: UserRepository;
      private readonly taskRepository: TaskRepository;
      private readonly taskFormService: TaskFormService;
      private readonly storeTaskService: StoreTaskService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly taskUserRepository: TaskUserRepository;
      private readonly notificationService: NotificationService;

      private ok$!: Subscription;
      private cancel$!: Subscription;
      private database$!: Subscription;
      private newTaskForm$!: Subscription;

      public constructor() {
            this.taskFormService = inject(TaskFormService);
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.notificationService = inject(NotificationService);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.taskUserRepository = inject<TaskUserRepository>(TASK_USER_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.database$ = this.userRepository.index().subscribe({
                  next: (users) => {
                        this.users = users;
                        this.modalInstance.title = 'New Task';
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.newTaskForm$ = this.taskFormService.form.valueChanges.subscribe({
                  next: (formData) => {
                        this.title = formData.title;
                        this.description = formData.description;
                        this.assignedUserId = formData.assignedUser;
                        this.modalInstance.disableSubmit = !this.taskFormService.form.valid;
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.ok$ = this.modalInstance.okEvent
                  .pipe(
                        concatMap(() =>
                              this.taskRepository.save({
                                    title: this.title,
                                    description: this.description,
                                    status: TaskStatus.TODO,
                              }),
                        ),
                        tap((task) => this.storeTaskService.add(task)),
                        switchMap((task) => this.taskUserRepository.attach(this.assignedUserId, task.id)),
                  )
                  .subscribe({
                        next: () => {
                              this.changeDetectorRef.detectChanges();
                              this.modalInstance.closeEvent.next();
                              this.notificationService.success('Task created successfully.');
                        },
                        error: () => {
                              this.changeDetectorRef.detectChanges();
                              this.storeTaskService.delete(this.storeTaskService.value[0], 'id');
                              this.notificationService.error('An error occurred, please try later.');
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
            this.ok$.unsubscribe();
            this.cancel$.unsubscribe();
            this.database$.unsubscribe();
            this.newTaskForm$.unsubscribe();
      }
}
