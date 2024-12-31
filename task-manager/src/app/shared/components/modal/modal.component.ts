import { ApplicationRef, Component, ElementRef, inject, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../button/button.component';
import { Subject } from 'rxjs';

@Component({
      standalone: true,
      selector: 'tm-modal',
      styleUrls: ['./modal.component.css'],
      templateUrl: './modal.component.html',
      imports: [CommonModule, ButtonComponent],
      host: {
            '[@modalZoomIn]': '',
      },
      animations: [
            trigger('modalZoomIn', [
                  transition(':enter', [
                        style({
                              transform: 'translate(-100vw, -50%)',
                        }),
                        animate('200ms', style({
                              transform: 'translate(-50%, -50%)',
                        }))
                  ]),
                  transition(':leave', [
                        style({
                              transform: 'translate(-50%, -50%)',
                        }),
                        animate('200ms', style({
                              transform: 'translate(-50%, 100vw)',
                        }))
                  ]),
            ]),
      ]
})
export class ModalComponent {

      @Input() public title!: string;

      private isCancelDisabled: boolean;
      private isSubmitDisabled: boolean;

      public closeEvent: Subject<void>;
      public submitEvent: Subject<void>;

      private readonly elementRef?: ElementRef;
      private readonly applicationRef: ApplicationRef;

      public constructor() {
            this.isCancelDisabled = false;
            this.isSubmitDisabled = false;
            this.closeEvent = new Subject<void>();
            this.submitEvent = new Subject<void>();

            this.elementRef = inject(ElementRef);
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
