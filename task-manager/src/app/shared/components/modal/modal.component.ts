import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../button/button.component';

@Component({
      standalone: true,
      selector: 'tm-modal',
      styleUrls: ['./modal.component.css'],
      templateUrl: './modal.component.html',
      imports: [CommonModule, ButtonComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {

      @Input() public title!: string;
      @Output() public closeEvent: EventEmitter<void>;
      @Output() public submitEvent: EventEmitter<void>;

      public constructor(
            private readonly elementRef?: ElementRef,
      ) {
            this.closeEvent = new EventEmitter<void>();
            this.submitEvent = new EventEmitter<void>();
      }

      public submit(): void {
            this.elementRef?.nativeElement.remove();
            this.submitEvent.emit();
      }

      public close(): void {
            this.elementRef?.nativeElement.remove();
            this.closeEvent.emit();
      }

}
