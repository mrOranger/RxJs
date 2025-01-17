import { Component, HostBinding, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, Project, StoreProjectService, TagComponent } from 'src/app/shared';
import * as moment from 'moment';
import { faClock, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
      standalone: true,
      selector: 'tm-project-list-item',
      templateUrl: './project-list-item.component.html',
      styleUrls: ['./project-list-item.component.css'],
      imports: [CommonModule, TagComponent, ButtonComponent, FontAwesomeModule],
})
export class ProjectListItemComponent {
      private readonly storeProjectService: StoreProjectService;

      public constructor() {
            this.storeProjectService = inject(StoreProjectService);
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
      }

      public onDelete(event: MouseEvent) {
            event.stopImmediatePropagation();
            this.storeProjectService.delete(this.project, 'id');
      }
}
