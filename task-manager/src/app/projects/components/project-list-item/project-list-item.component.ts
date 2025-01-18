import {
      ChangeDetectionStrategy,
      ChangeDetectorRef,
      Component,
      HostBinding,
      inject,
      Input,
      OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { faClock, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as moment from 'moment';

import { of, Subscription, switchMap } from 'rxjs';

import {
      ButtonComponent,
      DatabaseService,
      ModalService,
      NotificationService,
      Project,
      ProjectRepository,
      ProjectService,
      StoreProjectService,
      TagComponent,
} from 'src/app/shared';

import { PROJECT_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { UpdateProjectModalComponent } from '../update-project-modal/update-project-modal.component';

@Component({
      standalone: true,
      selector: 'tm-project-list-item',
      templateUrl: './project-list-item.component.html',
      styleUrls: ['./project-list-item.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CommonModule, TagComponent, ButtonComponent, FontAwesomeModule],
      providers: [
            ModalService,
            DatabaseService,
            NotificationService,
            NotificationService,
            { provide: PROJECT_REPOSITORY_TOKEN, useClass: ProjectService },
      ],
})
export class ProjectListItemComponent implements OnDestroy {
      private readonly modalService: ModalService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly projectRepository: ProjectRepository;
      private readonly storeProjectService: StoreProjectService;
      private readonly notificationService: NotificationService;

      private projectRepositoryDelete$!: Subscription;

      public constructor() {
            this.modalService = inject(ModalService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.storeProjectService = inject(StoreProjectService);
            this.notificationService = inject(NotificationService);
            this.projectRepository = inject<ProjectRepository>(PROJECT_REPOSITORY_TOKEN);
      }

      @Input() public project!: Project;

      @HostBinding('attr.draggable')
      public get draggable() {
            return true;
      }

      public get title() {
            return this.project.title;
      }

      public get description() {
            return this.project.description;
      }

      public get clock() {
            return faClock;
      }

      public get pencil() {
            return faPencilAlt;
      }

      public get trash() {
            return faTrash;
      }

      public get startingAt() {
            return `Starting at: ${moment(this.project.startingAt).format('DD/MM/YYYY')}`;
      }

      public get endingAt() {
            return `Ending at: ${moment(this.project.endingAt).format('DD/MM/YYYY')}`;
      }

      public onUpdate(event: MouseEvent) {
            event.stopImmediatePropagation();
            this.modalService.create({
                  title: 'Update Project',
                  closeDisabled: true,
                  submitDisabled: true,
                  component: UpdateProjectModalComponent,
                  params: {
                        project: this.project,
                  },
            });
      }

      public onDelete(event: MouseEvent) {
            this.projectRepositoryDelete$ = this.projectRepository.delete(this.project.id).subscribe({
                  next: () => {
                        this.storeProjectService.delete(this.project, 'id');
                        this.notificationService.success('Project deleted successfully.');
                        this.changeDetectorRef.detectChanges();
                  },
            });
            event.stopImmediatePropagation();
      }

      public ngOnDestroy(): void {
            this.projectRepositoryDelete$?.unsubscribe();
      }
}
