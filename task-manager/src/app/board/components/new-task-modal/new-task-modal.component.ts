import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Subscription, switchMap } from 'rxjs';

import {
      DatabaseService,
      InputComponent,
      ModalService,
      NotificationService,
      TaskRepository,
      TaskService,
} from 'src/app/shared';
import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { NewTaskFormService } from '../../services';

@Component({
      standalone: true,
      selector: 'tm-new-task-modal',
      templateUrl: './new-task-modal.component.html',
      styleUrls: ['./new-task-modal.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            NewTaskFormService,
            DatabaseService,
            NotificationService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
      ],
      imports: [FormsModule, ReactiveFormsModule, InputComponent],
})
export class NewTaskModalComponent implements OnInit, OnDestroy {
      private readonly modalService: ModalService;
      private readonly taskRepository: TaskRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly newTaskFormService: NewTaskFormService;
      private readonly notificationService: NotificationService;

      private newTaskFormService$?: Subscription;

      public constructor() {
            this.modalService = inject(ModalService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.newTaskFormService = inject(NewTaskFormService);
            this.notificationService = inject(NotificationService);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.newTaskFormService$ = this.newTaskFormService.form.valueChanges.subscribe({
                  next: (values) => {
                        this.modalService.updateConfig({
                              okDisabled: !this.newTaskFormService.form.valid,
                              cancelDisabled: false,
                        });
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.modalService.componentInstance?.okEvent
                  .pipe(switchMap(() => this.taskRepository.save(this.form.value)))
                  .subscribe({
                        next: (task) => {
                              this.modalService.componentInstance?.onClose();
                              this.changeDetectorRef.detectChanges();
                              this.notificationService.success('New task created successfully!');
                        },
                        error: (exception) => {
                              console.error(exception);
                              this.modalService.componentInstance?.onClose();
                              this.notificationService.error('Error in creating the task, please try later!');
                        },
                  });
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
