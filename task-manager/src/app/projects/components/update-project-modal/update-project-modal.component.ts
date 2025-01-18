import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
      DatabaseService,
      InputComponent,
      LocalStorageService,
      ModalComponent,
      NotificationService,
      Project,
      ProjectRepository,
      ProjectService,
      StoreProjectService,
      TextareaComponent,
} from 'src/app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectFormService } from '../../services';
import { Subscription, switchMap } from 'rxjs';
import { PROJECT_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      selector: 'tm-update-project-model',
      templateUrl: './update-project-modal.component.html',
      styleUrls: ['./update-project-modal.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [
            DatabaseService,
            ProjectFormService,
            LocalStorageService,
            NotificationService,
            { provide: PROJECT_REPOSITORY_TOKEN, useClass: ProjectService },
      ],
      imports: [CommonModule, InputComponent, TextareaComponent, ReactiveFormsModule],
})
export class UpdateProjectModalComponent implements OnInit, OnDestroy {
      @Input('project') public project!: Project;
      @Input('modalInstance') public modalInstance!: ModalComponent;

      private title!: string;
      private description!: string;
      private startingDate!: Date;
      private endingDate!: Date;

      private okEvent$!: Subscription;
      private closeEvent$!: Subscription;
      private formChanging$!: Subscription;

      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly projectRepository: ProjectRepository;
      private readonly projectFormService: ProjectFormService;
      private readonly storeProjectService: StoreProjectService;
      private readonly notificationService: NotificationService;
      private readonly localStorageService: LocalStorageService;

      public constructor() {
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.projectFormService = inject(ProjectFormService);
            this.localStorageService = inject(LocalStorageService);
            this.notificationService = inject(NotificationService);
            this.storeProjectService = inject(StoreProjectService);
            this.projectRepository = inject<ProjectRepository>(PROJECT_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            this.modalInstance.disableSubmit = true;

            this.projectFormService.data = {
                  title: this.project.title,
                  description: this.project.description,
                  startingDate: this.project.startingAt,
                  endingDate: this.project.endingAt,
            };

            this.formChanging$ = this.projectFormService.subscribeOnValueChanges({
                  next: (value) => {
                        const { title, description, starting_date, ending_date } = value;
                        this.title = title;
                        this.description = description;
                        this.startingDate = starting_date;
                        this.endingDate = ending_date;
                        this.modalInstance.disableSubmit = !this.projectFormService.form.valid;
                        this.changeDetectorRef.detectChanges();
                  },
            });

            this.okEvent$ = this.modalInstance.okEvent
                  .pipe(
                        switchMap(() =>
                              this.projectRepository.update(this.project.id, {
                                    title: this.title,
                                    description: this.description,
                                    startingAt: this.startingDate,
                                    endingAt: this.endingDate,
                                    ownerId: this.localStorageService.userId,
                              }),
                        ),
                  )
                  .subscribe({
                        next: (newProject) => {
                              this.storeProjectService.update(newProject, 'id');
                              this.notificationService.success('Project updated successfully');
                              this.changeDetectorRef.detectChanges();
                              this.ngOnDestroy();
                              this.modalInstance.onClose();
                        },
                  });

            this.closeEvent$ = this.modalInstance.closeEvent.subscribe({
                  next: () => this.ngOnDestroy(),
            });
      }

      public get formService() {
            return this.projectFormService;
      }

      public ngOnDestroy(): void {
            this.okEvent$.unsubscribe();
            this.closeEvent$.unsubscribe();
            this.formChanging$.unsubscribe();
      }
}
