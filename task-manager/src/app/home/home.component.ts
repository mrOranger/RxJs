import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { forkJoin, Subscription } from 'rxjs';

import {
      DatabaseService,
      Project,
      ProjectRepository,
      ProjectService,
      StoreSelectedProjectService,
      StoreTaskService,
      StoreTaskUserService,
      StoreUserService,
      TabComponent,
      TabListComponent,
      TaskRepository,
      TaskService,
      TaskStatus,
      TaskUserRepository,
      TaskUserService,
      UserRepository,
      UserService,
} from '../shared';
import {
      PROJECT_REPOSITORY_TOKEN,
      TASK_REPOSITORY_TOKEN,
      TASK_USER_REPOSITORY_TOKEN,
      USER_REPOSITORY_TOKEN,
} from '../injection-tokens';
import { TaskListComponent } from '../board';

@Component({
      standalone: true,
      selector: 'tm-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CommonModule, TaskListComponent, TabComponent, TabListComponent, NgFor],
      providers: [
            DatabaseService,
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: PROJECT_REPOSITORY_TOKEN, useClass: ProjectService },
            { provide: TASK_USER_REPOSITORY_TOKEN, useClass: TaskUserService },
      ],
})
export class HomeComponent implements OnInit, OnDestroy {
      private projects!: Project[];

      private data$!: Subscription;
      private projects$!: Subscription;

      private readonly taskRepository: TaskRepository;
      private readonly userRepository: UserRepository;
      private readonly storeTaskService: StoreTaskService;
      private readonly storeUserService: StoreUserService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly projectRepository: ProjectRepository;
      private readonly taskUserRepository: TaskUserRepository;
      private readonly storeTaskUserService: StoreTaskUserService;
      private readonly storeSelectedProjectService: StoreSelectedProjectService;

      public constructor() {
            this.storeUserService = inject(StoreUserService);
            this.storeTaskService = inject(StoreTaskService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.storeTaskUserService = inject(StoreTaskUserService);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.storeSelectedProjectService = inject(StoreSelectedProjectService);
            this.projectRepository = inject<ProjectRepository>(PROJECT_REPOSITORY_TOKEN);
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

            this.projects$ = this.projectRepository.index().subscribe({
                  next: (projects) => {
                        this.projects = projects;
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get databaseProjects() {
            return this.projects ?? [];
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

      public get selectedProject() {
            return this.storeSelectedProjectService.value;
      }

      public onSelectProject(project: Project) {
            this.storeSelectedProjectService.value = project;
      }

      public ngOnDestroy(): void {
            this.data$.unsubscribe();
            this.projects$.unsubscribe();
      }
}
