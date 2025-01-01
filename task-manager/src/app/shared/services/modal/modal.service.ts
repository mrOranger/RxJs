import { ApplicationRef, ComponentRef, inject, Injectable, Type, ViewContainerRef } from '@angular/core';

import { ModalComponent } from '../../components';

@Injectable({ providedIn: 'root' })
export class ModalService {
      private modalRef?: ComponentRef<ModalComponent>;
      public readonly applicationRef: ApplicationRef;

      public constructor() {
            this.applicationRef = inject(ApplicationRef);
      }

      public create<T, V>(params: {
            component: Type<T>;
            title: string;
            width?: string;
            height?: string;
            onOk?: () => V;
            onClose?: () => void;
            submitDisabled?: boolean;
            closeDisabled?: boolean;
      }): void {
            const { title, width, height, onClose, onOk, component, closeDisabled, submitDisabled } = params;

            const rootComponent = this.applicationRef.components.at(0);
            rootComponent?.location.nativeElement.classList.add('blur');
            const rootComponentViewContainer = rootComponent!.injector.get(ViewContainerRef);

            const modalComponentRef = rootComponentViewContainer?.createComponent(ModalComponent);

            const modalViewContainer = modalComponentRef?.location.nativeElement.querySelector('.main');

            const injectedComponentRef = rootComponentViewContainer?.createComponent(component);

            modalComponentRef.instance.title = title;
            modalComponentRef.instance.okEvent.subscribe({ next: onOk });
            modalComponentRef.instance.closeEvent.subscribe({ next: onClose });
            modalComponentRef.instance.disableCancel = !!closeDisabled;
            modalComponentRef.instance.disableSubmit = !!submitDisabled;
            modalComponentRef.location.nativeElement.setAttribute('style', `width: ${width}; height: ${height}`);

            modalViewContainer.appendChild(injectedComponentRef!.location.nativeElement);

            this.modalRef = modalComponentRef;
      }

      public get onClose() {
            return this.modalRef?.instance.closeEvent;
      }

      public get onOk() {
            return this.modalRef?.instance.okEvent;
      }

      public updateConfig(config: { okDisabled: boolean; cancelDisabled: boolean }) {
            if (this.modalRef) {
                  this.modalRef.instance.disableSubmit = config.okDisabled;
                  this.modalRef.instance.disableCancel = config.cancelDisabled;
            }
      }
}
