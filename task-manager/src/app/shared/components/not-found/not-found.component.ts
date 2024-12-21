import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
      standalone: true,
      selector: 'tm-not-found',
      templateUrl: './not-found.component.html',
      styleUrls: ['./not-found.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [RouterLink, RouterLinkActive]
})
export class NotFoundComponent {}
