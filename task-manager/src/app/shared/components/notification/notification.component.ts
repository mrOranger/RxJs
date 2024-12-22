import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
      standalone: true,
      selector: 'tm-notification',
      templateUrl: './notification.component.html',
      styleUrls: ['./notification.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [
            NgClass,
            FontAwesomeModule,
      ]
})
export class NotificationComponent {

      @Input() public icon!: IconDefinition;
      @Input() public type!: 'error' | 'success';
      @Input() public title!: string;
      @Input() public message!: string;

}
