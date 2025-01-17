import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import {
      DatabaseService,
      LoaderService,
      NotificationService,
      Project,
      ProjectRepository,
      ProjectService,
      StoreProjectService,
} from 'src/app/shared';

import { PROJECT_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

import { EmptyProjectListComponent } from '../empty-project-list/empty-project-list.component';
import { ProjectListItemComponent } from '../project-list-item/project-list-item.component';

@Component({
      standalone: true,
      selector: 'tm-project-list',
      templateUrl: './project-list.component.html',
      styleUrls: ['./project-list.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CommonModule, EmptyProjectListComponent, ProjectListItemComponent],
      providers: [
            LoaderService,
            DatabaseService,
            NotificationService,
            { provide: PROJECT_REPOSITORY_TOKEN, useClass: ProjectService },
      ],
})
export class ProjectListComponent implements OnInit, OnDestroy {
      private readonly loaderService: LoaderService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly projectRepository: ProjectRepository;
      private readonly storeProjectService: StoreProjectService;
      private readonly notificationService!: NotificationService;

      private projects!: Project[];

      private projectRepository$!: Subscription;
      private storeProjectsService$!: Subscription;

      public constructor() {
            this.loaderService = inject(LoaderService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.storeProjectService = inject(StoreProjectService);
            this.projectRepository = inject<ProjectRepository>(PROJECT_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.loaderService.start('Loading Projects ...');

            this.storeProjectsService$ = this.storeProjectService.subscribe({
                  next: (projects) => {
                        this.projects = projects;
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.projectRepository$ = this.projectRepository.index().subscribe({
                  next: (projects) => {
                        this.loaderService.stop();
                        this.storeProjectService.value = projects;
                        this.changeDetectorRef.detectChanges();
                  },
                  error: () => {
                        this.loaderService.stop();
                        this.notificationService.error('An error occurred please try later');
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get databaseProjects() {
            return this.projects ?? [];
      }

      public ngOnDestroy(): void {
            this.projectRepository$.unsubscribe();
            this.storeProjectsService$.unsubscribe();
      }
}
