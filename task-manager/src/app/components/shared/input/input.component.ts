import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
      standalone: true,
      selector: 'tm-input',
      templateUrl: './input.component.html',
      styleUrls: ['./input.component.css'],
      encapsulation: ViewEncapsulation.None,
      imports: [FormsModule],
})
export class InputComponent {}
