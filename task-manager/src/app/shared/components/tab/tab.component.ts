import {
      ChangeDetectionStrategy,
      ChangeDetectorRef,
      Component,
      EventEmitter,
      HostBinding,
      HostListener,
      inject,
      Input,
      Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
      standalone: true,
      selector: 'tm-tab',
      templateUrl: './tab.component.html',
      styleUrls: ['./tab.component.css'],
      imports: [CommonModule, FontAwesomeModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
      @Input() public label!: string;
      @Input() public selected?: boolean;
      @Input() public disabled?: boolean;
      @Input() public icon?: IconDefinition;

      @Output() public clicked: EventEmitter<void>;

      private readonly changeDetectorRef: ChangeDetectorRef;

      public constructor() {
            this.disabled = false;
            this.clicked = new EventEmitter<void>();
            this.changeDetectorRef = inject(ChangeDetectorRef);
      }

      @HostBinding('attr.disabled')
      public get isDisabled() {
            return this.disabled ? '' : null;
      }

      @HostBinding('class.selected')
      public get isSelected() {
            return this.selected;
      }

      @HostListener('click', ['$event'])
      public onClick(event: MouseEvent): void {
            if (!this.disabled) {
                  event.preventDefault();
                  this.clicked.emit();
                  this.changeDetectorRef.detectChanges();
            }
      }
}
