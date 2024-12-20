import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
      standalone: true,
      selector: 'tm-radio-group',
      templateUrl: './radio-group.component.html',
      styleUrls: ['./radio-group.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent {}
