import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { ButtonComponent, ModalService, StoreSelectedProjectService } from 'src/app/shared';
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
      private readonly storeSelectedProject: StoreSelectedProjectService;

      public constructor() {
            this.router = inject(Router);
            this.modalService = inject(ModalService);
            this.storeSelectedProject = inject(StoreSelectedProjectService);
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
                  newTask: this.router.url === '/home' && !!this.storeSelectedProject.value,
                  newProject: this.router.url === '/projects',
            };
      }

      @HostBinding('attr.hidden')
      public get isVisible() {
            return !Object.values(this.visibilities).reduce((acc, visible) => visible || acc, false);
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
