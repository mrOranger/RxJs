import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, TagComponent } from 'src/app/shared';
import * as moment from 'moment';
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
      standalone: true,
      selector: 'tm-project-list-item',
      imports: [CommonModule, TagComponent],
      templateUrl: './project-list-item.component.html',
      styleUrls: ['./project-list-item.component.css'],
})
export class ProjectListItemComponent {
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

      public get startingAt() {
            return `Starting at: ${moment(this.project.startingAt).format('DD/MM/YYYY')}`;
      }

      public get endingAt() {
            return `Ending at: ${moment(this.project.endingAt).format('DD/MM/YYYY')}`;
      }
}
