import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { ButtonComponent, ModalService } from 'src/app/shared';
import { Router, RouterModule } from '@angular/router';
import { NewTaskModalComponent } from 'src/app/board';
import { NewProjectModalComponent } from 'src/app/projects';

@Component({
      standalone: true,
      selector: 'tm-sidebar-left',
      styleUrls: ['./sidebar-left.component.css'],
      templateUrl: './sidebar-left.component.html',
      imports: [CommonModule, FontAwesomeModule, ButtonComponent, RouterModule],
})
export class SidebarLeftComponent {
      private readonly router: Router;
      private readonly modalService: ModalService;

      public constructor() {
            this.router = inject(Router);
            this.modalService = inject(ModalService);
      }

      public onNewTask() {
            this.modalService.create({
                  component: NewTaskModalComponent,
                  title: 'New task',
                  width: '60%',
                  closeDisabled: false,
                  submitDisabled: true,
            });
      }

      public get icons() {
            return {
                  newTask: faPlus,
                  newProject: faPlus,
            };
      }

      public get labels() {
            return {
                  newTask: 'New Task',
                  newProject: 'New Project',
            };
      }

      public get visibilities() {
            return {
                  newTask: this.router.url === '/home',
                  newProject: this.router.url === '/projects',
            };
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
