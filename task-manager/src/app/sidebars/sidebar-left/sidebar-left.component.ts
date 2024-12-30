import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ModalService } from 'src/app/shared';
import { NewTaskModalComponent } from 'src/app/board';

@Component({
      standalone: true,
      selector: 'tm-sidebar-left',
      imports: [CommonModule, FontAwesomeModule],
      styleUrls: ['./sidebar-left.component.css'],
      templateUrl: './sidebar-left.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [ModalService],
})
export class SidebarLeftComponent {

      public constructor(
            private readonly modalService: ModalService,
      ) {}

      public onNewTask() {
            this.modalService.create({
                  component: NewTaskModalComponent,
                  title: 'New task',
                  close: () => { console.log('Close modal'); },
                  submit: () => { console.log('Submit modal'); },
            });
      }

      public get newTaskIcon() {
            return faPlusCircle;
      }

}
