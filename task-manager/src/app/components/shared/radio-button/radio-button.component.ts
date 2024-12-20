import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
      standalone: true,
      selector: 'tm-radio-button',
      templateUrl: './radio-button.component.html',
      styleUrls: ['./radio-button.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent {

      @Input() public label!: string;

}
