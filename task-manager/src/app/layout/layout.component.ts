import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
      standalone: true,
      selector: 'tm-layout',
      templateUrl: './layout.component.html',
      styleUrls: ['./layout.component.css'],
      imports: [RouterOutlet],
})
export class LayoutComponent {}