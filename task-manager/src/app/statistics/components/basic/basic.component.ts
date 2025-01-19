import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forkJoin, Subscription } from 'rxjs';

import {
      DatabaseService,
      Project,
      ProjectRepository,
      ProjectService,
      Task,
      TaskRepository,
      TaskService,
      User,
      UserRepository,
      UserService,
} from 'src/app/shared';

import { PROJECT_REPOSITORY_TOKEN, TASK_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      selector: 'tm-basic',
      imports: [CommonModule],
      templateUrl: './basic.component.html',
      styleUrls: ['./basic.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            DatabaseService,
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
            { provide: PROJECT_REPOSITORY_TOKEN, useClass: ProjectService },
      ],
})
export class BasicComponent implements OnInit, OnDestroy {
      private readonly userRepository: UserRepository;
      private readonly taskRepository: TaskRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly projectRepository: ProjectRepository;

      private data$!: Subscription;

      private users?: User[];
      private tasks?: Task[];
      private projects?: Project[];

      public constructor() {
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);
            this.projectRepository = inject<ProjectRepository>(PROJECT_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.data$ = forkJoin([
                  this.userRepository.index(),
                  this.taskRepository.index(),
                  this.projectRepository.index(),
            ]).subscribe({
                  next: ([users, tasks, projects]) => {
                        this.users = users;
                        this.tasks = tasks;
                        this.projects = projects;
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get totalUsers() {
            return this.users?.length ?? 0;
      }

      public get totalTasks() {
            return this.tasks?.length ?? 0;
      }

      public get totalProjects() {
            return this.projects?.length ?? 0;
      }

      public ngOnDestroy(): void {
            this.data$.unsubscribe();
      }
}
