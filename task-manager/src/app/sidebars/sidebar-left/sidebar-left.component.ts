import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
      standalone: true,
      selector: 'tm-sidebar-left',
      imports: [CommonModule, FontAwesomeModule],
      styleUrls: ['./sidebar-left.component.css'],
      templateUrl: './sidebar-left.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLeftComponent {

      public onNewTask() {
            console.log('onNewTask');
      }

      public get newTaskIcon() {
            return faPlusCircle;
      }

}
