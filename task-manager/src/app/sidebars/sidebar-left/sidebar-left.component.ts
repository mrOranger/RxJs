import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Subscription } from 'rxjs';

import { ButtonComponent, DatabaseService, ModalService, Task, TaskRepository, TaskService } from 'src/app/shared';
import { NewTaskModalComponent, NewTaskStoreService } from 'src/app/board';
import { TASK_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      selector: 'tm-sidebar-left',
      styleUrls: ['./sidebar-left.component.css'],
      templateUrl: './sidebar-left.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CommonModule, FontAwesomeModule, ButtonComponent],
      providers: [
            DatabaseService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService }
      ]
})
export class SidebarLeftComponent implements OnInit, OnDestroy {

      private task?: Partial<Task | null>;

      private readonly modalService: ModalService;
      private readonly taskRepository: TaskRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly newTaskStoreService: NewTaskStoreService;

      private newTaskStoreService$?: Subscription;

      public constructor() {
            this.modalService = inject(ModalService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.newTaskStoreService = inject(NewTaskStoreService);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.newTaskStoreService$ = this.newTaskStoreService.subscribe({
                  next: (task) => {
                        this.task = task;
                        this.changeDetectorRef.detectChanges();
                  }
            });
      }

      public onNewTask() {
            this.modalService.create({
                  component: NewTaskModalComponent,
                  title: 'New task',
                  width: '60%',
                  height: '50%',
                  onOk: () => {
                        console.log(this.task);
                   },
                  closeDisabled: false,
                  submitDisabled: true,
            });
      }

      public get newTaskIcon() {
            return faPlusCircle;
      }

      public ngOnDestroy(): void {
            this.newTaskStoreService$?.unsubscribe();
      }

}
