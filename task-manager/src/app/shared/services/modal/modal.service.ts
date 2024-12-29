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

            const container = this.applicationRef.components[0].injector.get(ViewContainerRef);
            const modalComponentRef = container.createComponent(ModalComponent);
            const modalViewContainer = modalComponentRef.location.nativeElement.querySelector('.main')
            const componentRef = container.createComponent(component);

            modalComponentRef.instance.title = title;
            modalComponentRef.instance.submitEvent.subscribe({ next: submit(), });
            modalComponentRef.instance.closeEvent.subscribe({ next: close(), });

            modalViewContainer.appendChild(componentRef.location.nativeElement);
      }
}
