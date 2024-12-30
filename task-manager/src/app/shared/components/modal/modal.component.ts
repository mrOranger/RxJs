import { ApplicationRef, Component, ElementRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../button/button.component';
import { Subject } from 'rxjs';

@Component({
      standalone: true,
      selector: 'tm-modal',
      styleUrls: ['./modal.component.css'],
      templateUrl: './modal.component.html',
      imports: [CommonModule, ButtonComponent],
})
export class ModalComponent {

      @Input() public title!: string;

      private isCancelDisabled: boolean;
      private isSubmitDisabled: boolean;

      public closeEvent: Subject<void>;
      public submitEvent: Subject<void>;

      private readonly applicationRef: ApplicationRef;

      public constructor(
            private readonly elementRef?: ElementRef,
      ) {
            this.isCancelDisabled = false;
            this.isSubmitDisabled = false;
            this.closeEvent = new Subject<void>();
            this.submitEvent = new Subject<void>();

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

      public get disableSubmit() {
            return this.isSubmitDisabled;
      }

      public set disableSubmit(disabled: boolean) {
            this.isSubmitDisabled = disabled;
      }

      public get disableCancel() {
            return this.isCancelDisabled;
      }

      public set disableCancel(disabled: boolean) {
            this.isCancelDisabled = disabled;
      }

      private removeBlur() {
            const rootComponent = this.applicationRef.components.at(0);
            rootComponent?.location.nativeElement.classList.remove('blur');
      }

}
