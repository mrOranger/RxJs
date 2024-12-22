import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
      standalone: true,
      selector: 'tm-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'],
      imports: [RouterOutlet],
})
export class AppComponent {}
