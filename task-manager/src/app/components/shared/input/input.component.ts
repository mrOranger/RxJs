import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
      selector: 'tm-input',
      templateUrl: './input.component.html',
      styleUrls: ['./input.component.css'],
      standalone: true,
      imports: [FormsModule],
      encapsulation: ViewEncapsulation.None,
})
export class InputComponent {}
