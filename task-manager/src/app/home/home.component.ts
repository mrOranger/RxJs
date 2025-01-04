import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forkJoin, Subscription } from 'rxjs';

import {
      DatabaseService,
      StoreTaskService,
      StoreTaskUserService,
      StoreUserService,
      TaskRepository,
      TaskService,
      TaskStatus,
      TaskUserRepository,
      TaskUserService,
      UserRepository,
      UserService,
} from '../shared';
import { TASK_REPOSITORY_TOKEN, TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from '../injection-tokens';
import { TaskListComponent } from '../board';

@Component({
      standalone: true,
      selector: 'tm-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css'],
      imports: [CommonModule, TaskListComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            DatabaseService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: TASK_USER_REPOSITORY_TOKEN, useClass: TaskUserService },
      ],
})
export class HomeComponent implements OnInit, OnDestroy {
      private data$!: Subscription;
      private readonly taskRepository: TaskRepository;
      private readonly userRepository: UserRepository;
      private readonly storeTaskService: StoreTaskService;
      private readonly storeUserService: StoreUserService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly taskUserRepository: TaskUserRepository;
      private readonly storeTaskUserService: StoreTaskUserService;

      public constructor() {
            this.storeUserService = inject(StoreUserService);
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.storeTaskUserService = inject(StoreTaskUserService);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.taskUserRepository = inject<TaskUserRepository>(TASK_USER_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.data$ = forkJoin([
                  this.userRepository.index(),
                  this.taskRepository.index(),
                  this.taskUserRepository.index(),
            ]).subscribe({
                  next: ([users, tasks, assignations]) => {
                        this.storeUserService.value = users;
                        this.storeTaskService.value = tasks;
                        this.storeTaskUserService.value = assignations;
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get todoStatus() {
            return TaskStatus.TODO;
      }

      public get inProgressStatus() {
            return TaskStatus.IN_PROGRESS;
      }

      public get completedStatus() {
            return TaskStatus.COMPLETED;
      }

      public ngOnDestroy(): void {
            this.data$.unsubscribe();
      }
}
