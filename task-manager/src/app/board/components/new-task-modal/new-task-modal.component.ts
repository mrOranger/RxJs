import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { forkJoin, Subscription, switchMap } from 'rxjs';

import {
      User,
      TaskService,
      UserService,
      ModalService,
      InputComponent,
      TaskRepository,
      UserRepository,
      TaskUserService,
      SelectComponent,
      DatabaseService,
      TaskUserRepository,
      NotificationService,
      Task,
      TextareaComponent,
} from 'src/app/shared';
import { TASK_REPOSITORY_TOKEN, TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { NewTaskFormService } from '../../services';

@Component({
      standalone: true,
      selector: 'tm-new-task-modal',
      templateUrl: './new-task-modal.component.html',
      styleUrls: ['./new-task-modal.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            DatabaseService,
            NewTaskFormService,
            NotificationService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: TASK_USER_REPOSITORY_TOKEN, useClass: TaskUserService },
      ],
      imports: [FormsModule, ReactiveFormsModule, InputComponent, SelectComponent, TextareaComponent],
})
export class NewTaskModalComponent implements OnInit, OnDestroy {
      private readonly modalService: ModalService;
      private readonly taskRepository: TaskRepository;
      private readonly userRepository: UserRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly newTaskFormService: NewTaskFormService;
      private readonly taskUserRepository: TaskUserRepository;
      private readonly notificationService: NotificationService;

      private newTaskFormService$?: Subscription;

      private taskTitle!: string;
      private taskDescription!: string;
      private assignationUserId!: string;
      private availableUsers?: User[];

      public constructor() {
            this.modalService = inject(ModalService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.newTaskFormService = inject(NewTaskFormService);
            this.notificationService = inject(NotificationService);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.taskUserRepository = inject<TaskUserRepository>(TASK_USER_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.newTaskFormService$ = this.newTaskFormService.form.valueChanges.subscribe({
                  next: (values) => {
                        this.taskTitle = values.title;
                        this.taskDescription = values.description;
                        this.assignationUserId = values.assigned_user;
                        this.modalService.updateConfig({
                              okDisabled: !this.newTaskFormService.form.valid,
                              cancelDisabled: false,
                        });
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.userRepository.index().subscribe({
                  next: (users) => {
                        this.availableUsers = users;
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.modalService.componentInstance?.okEvent.subscribe({
                  next: () =>
                        this.taskRepository
                              .save(<Task>{
                                    title: this.taskTitle,
                                    description: this.taskDescription,
                              })
                              .pipe(
                                    switchMap((task) =>
                                          this.taskUserRepository.attach(this.assignationUserId, task.id),
                                    ),
                              )
                              .subscribe({
                                    next: () => {
                                          this.modalService.componentInstance?.onClose();
                                          this.changeDetectorRef.detectChanges();
                                          this.notificationService.success('New task created successfully!');
                                    },
                                    error: (exception) => {
                                          console.error(exception);
                                          this.modalService.componentInstance?.onClose();
                                          this.notificationService.error(
                                                'Error in creating the task, please try later!',
                                          );
                                    },
                              }),
            });
      }

      public get users() {
            return this.availableUsers ?? [];
      }

      public get form() {
            return this.newTaskFormService.form;
      }

      public get formService() {
            return this.newTaskFormService;
      }

      public ngOnDestroy(): void {
            this.newTaskFormService$?.unsubscribe();
      }
}
