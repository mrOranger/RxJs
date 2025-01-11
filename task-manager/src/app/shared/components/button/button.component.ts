import { Component, HostBinding, Input } from '@angular/core';

@Component({
      standalone: true,
      selector: 'button[tmButton]',
      templateUrl: './button.component.html',
      styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
      @Input() public hidden: boolean;

      public constructor() {
            this.hidden = false;
      }

      @HostBinding('attr.hidden')
      public get isVisible() {
            return this.hidden;
      }
}
