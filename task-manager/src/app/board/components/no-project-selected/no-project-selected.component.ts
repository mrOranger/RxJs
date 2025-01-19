import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
      standalone: true,
      selector: 'tm-no-project-selected',
      imports: [RouterLink, RouterLinkActive],
      templateUrl: './no-project-selected.component.html',
      styleUrls: ['./no-project-selected.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoProjectSelectedComponent {
      @Input() public label?: string;

      public constructor() {
            this.label = 'You have to select a new project, or';
      }
}
