import {
      ApplicationRef,
      ChangeDetectionStrategy,
      ChangeDetectorRef,
      Component,
      ElementRef,
      inject,
      Input,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

import { Subject } from 'rxjs';

import { ButtonComponent } from '../button/button.component';

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
                        animate(
                              '200ms',
                              style({
                                    transform: 'translate(-50%, -50%)',
                              }),
                        ),
                  ]),
                  transition(':leave', [
                        style({
                              transform: 'translate(-50%, -50%)',
                        }),
                        animate(
                              '200ms',
                              style({
                                    transform: 'translate(-50%, 100vw)',
                              }),
                        ),
                  ]),
            ]),
      ],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
      private modalTitle!: string;
      private isCancelDisabled: boolean;
      private isSubmitDisabled: boolean;

      public closeEvent: Subject<void>;
      public okEvent: Subject<void>;

      private readonly elementRef?: ElementRef;
      private readonly applicationRef: ApplicationRef;
      private readonly changeDetectorRef: ChangeDetectorRef;

      public constructor() {
            this.elementRef = inject(ElementRef);
            this.applicationRef = inject(ApplicationRef);
            this.changeDetectorRef = inject(ChangeDetectorRef);

            this.modalTitle = 'Modal';
            this.isCancelDisabled = false;
            this.isSubmitDisabled = false;
            this.closeEvent = new Subject<void>();
            this.okEvent = new Subject<void>();
      }

      public get title() {
            return this.modalTitle;
      }

      public set title(newTitle: string) {
            this.modalTitle = newTitle;
            this.changeDetectorRef.detectChanges();
      }

      public get disableSubmit() {
            return this.isSubmitDisabled;
      }

      public set disableSubmit(disabled: boolean) {
            this.isSubmitDisabled = disabled;
            this.changeDetectorRef.detectChanges();
      }

      public get disableCancel() {
            return this.isCancelDisabled;
      }

      public set disableCancel(disabled: boolean) {
            this.isCancelDisabled = disabled;
            this.changeDetectorRef.detectChanges();
      }

      public onOk(): void {
            this.okEvent.next();
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
