import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
      selector: 'tm-notification',
      templateUrl: './notification.component.html',
      styleUrls: ['./notification.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {

      @Input() public icon!: IconDefinition;
      @Input() public type!: 'error' | 'success';
      @Input() public title!: string;
      @Input() public message!: string;

}
