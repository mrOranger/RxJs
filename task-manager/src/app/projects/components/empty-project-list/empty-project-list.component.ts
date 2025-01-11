import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/shared';
import { NewProjectModalComponent } from '../new-project-modal/new-project-modal.component';

@Component({
      standalone: true,
      imports: [CommonModule],
      selector: 'tm-empty-project-list',
      templateUrl: './empty-project-list.component.html',
      styleUrls: ['./empty-project-list.component.css'],
})
export class EmptyProjectListComponent {
      private readonly modalService: ModalService;

      public constructor() {
            this.modalService = inject(ModalService);
      }

      public onNewProject() {
            this.modalService.create({
                  component: NewProjectModalComponent,
                  title: 'New Project',
                  width: '60%',
                  closeDisabled: false,
                  submitDisabled: true,
            });
      }
}
