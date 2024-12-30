import { ApplicationRef, ComponentRef, inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../../components';

@Injectable()
export class ModalService {

      public readonly applicationRef: ApplicationRef;

      public constructor() {
            this.applicationRef = inject(ApplicationRef);
      }

      public create <T> (params: { component: Type<T>, title: string, close: () => void, submit: () => void }): void {
            const { title, close, submit, component } = params;

            const rootComponent = this.applicationRef.components.at(0);
            rootComponent?.location.nativeElement.classList.add('blur');
            const rootComponentViewContainer = rootComponent!.injector.get(ViewContainerRef);

            const modalComponentRef = rootComponentViewContainer?.createComponent(ModalComponent);
            const modalViewContainer = modalComponentRef?.location.nativeElement.querySelector('.main');

            const injectedComponentRef = rootComponentViewContainer?.createComponent(component);

            modalComponentRef.instance.title = title;
            modalComponentRef.instance.submitEvent.subscribe({ next: submit, });
            modalComponentRef.instance.closeEvent.subscribe({ next: close, });

            modalViewContainer.appendChild(injectedComponentRef!.location.nativeElement);
      }
}
