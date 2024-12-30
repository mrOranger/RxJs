import { ApplicationRef, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../button/button.component';
import { Subject } from 'rxjs';

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

      public closeEvent: Subject<void>;
      public submitEvent: Subject<void>;

      private readonly applicationRef: ApplicationRef;

      public constructor(
            private readonly elementRef?: ElementRef,
      ) {
            this.closeEvent = new EventEmitter<void>();
            this.submitEvent = new EventEmitter<void>();

            this.applicationRef = inject(ApplicationRef);
      }

      public onSubmit(): void {
            this.submitEvent.next();
            this.removeBlur();
            this.elementRef?.nativeElement.remove();
      }

      public onClose(): void {
            this.closeEvent.next();
            this.removeBlur();
            this.elementRef?.nativeElement.remove();
      }

      private removeBlur() {
            const rootComponent = this.applicationRef.components.at(0);
            rootComponent?.location.nativeElement.classList.remove('blur');
      }

}
