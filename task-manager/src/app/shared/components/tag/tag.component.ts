import { Component, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
      standalone: true,
      selector: 'tm-tag',
      templateUrl: './tag.component.html',
      styleUrls: ['./tag.component.css'],
      imports: [CommonModule, FontAwesomeModule],
})
export class TagComponent {
      @Input() public label!: string;
      @Input() public icon!: IconDefinition;
      @Input() public type!: 'success' | 'error' | 'warning' | 'info';

      public readonly clicked: EventEmitter<void>;

      public constructor() {
            this.type = 'info';
            this.clicked = new EventEmitter<void>();
      }

      @HostBinding('class')
      public get tagType() {
            return this.type;
      }

      @HostListener('click', ['$event'])
      public onClick() {
            this.clicked.emit();
      }
}
