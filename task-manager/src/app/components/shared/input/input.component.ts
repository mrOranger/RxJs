import { Component, Input } from '@angular/core';

@Component({
      selector: 'tm-input',
      templateUrl: './input.component.html',
      styleUrls: ['./input.component.css'],
      standalone: true,
})
export class InputComponent {
      @Input({ required: true }) public title!: string;
      @Input({ required: true }) public type!: 'email' | 'password';
      @Input({ required: true }) public name!: string;
      @Input({ required: true }) public placeholder!: string;
}
