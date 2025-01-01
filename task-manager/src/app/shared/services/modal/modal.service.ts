import { ApplicationRef, ComponentRef, inject, Injectable, Type, ViewContainerRef } from '@angular/core';

import { ModalComponent } from '../../components';

@Injectable({ providedIn: 'root' })
export class ModalService {
      private modalRef?: ComponentRef<ModalComponent>;
      public readonly applicationRef: ApplicationRef;

      public constructor() {
            this.applicationRef = inject(ApplicationRef);
      }

      public create<T>(params: {
            component: Type<T>;
            title: string;
            width: string;
            height: string;
            onSubmit?: () => void;
            onClose?: () => void;
            submitDisabled?: boolean;
            closeDisabled?: boolean;
      }): void {
            const { title, width, height, onClose, onSubmit, component, closeDisabled, submitDisabled } = params;

            const rootComponent = this.applicationRef.components.at(0);
            rootComponent?.location.nativeElement.classList.add('blur');
            const rootComponentViewContainer = rootComponent!.injector.get(ViewContainerRef);

            const modalComponentRef = rootComponentViewContainer?.createComponent(ModalComponent);

            const modalViewContainer = modalComponentRef?.location.nativeElement.querySelector('.main');

            const injectedComponentRef = rootComponentViewContainer?.createComponent(component);

            modalComponentRef.instance.title = title;
            modalComponentRef.instance.submitEvent.subscribe({ next: onSubmit });
            modalComponentRef.instance.closeEvent.subscribe({ next: onClose });
            modalComponentRef.instance.disableCancel = !!closeDisabled;
            modalComponentRef.instance.disableSubmit = !!submitDisabled;
            modalComponentRef.location.nativeElement.setAttribute('style', `width: ${width}; height: ${height}`);

            modalViewContainer.appendChild(injectedComponentRef!.location.nativeElement);

            this.modalRef = modalComponentRef;
      }

      public updateConfig(config: { okDisabled: boolean; cancelDisabled: boolean }) {
            if (this.modalRef) {
                  this.modalRef.instance.disableSubmit = config.okDisabled;
                  this.modalRef.instance.disableCancel = config.cancelDisabled;
            }
      }
}
