import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent, ModalService } from 'src/app/shared';
import { NewTaskModalComponent } from 'src/app/board';

@Component({
      standalone: true,
      selector: 'tm-sidebar-left',
      styleUrls: ['./sidebar-left.component.css'],
      templateUrl: './sidebar-left.component.html',
      imports: [CommonModule, FontAwesomeModule, ButtonComponent],
})
export class SidebarLeftComponent {

      private readonly modalService: ModalService;

      public constructor() {
            this.modalService = inject(ModalService);
      }

      public onNewTask() {
            this.modalService.create({
                  component: NewTaskModalComponent,
                  title: 'New task',
                  width: '40%',
                  height: '60%',
                  closeDisabled: false,
                  submitDisabled: true,
            });
      }

      public get newTaskIcon() {
            return faPlusCircle;
      }

}
