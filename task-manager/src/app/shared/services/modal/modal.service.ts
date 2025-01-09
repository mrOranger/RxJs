import {
      ApplicationRef,
      ComponentRef,
      inject,
      Injectable,
      reflectComponentType,
      Type,
      ViewContainerRef,
} from '@angular/core';

import { ModalComponent } from '../../components';

@Injectable({ providedIn: 'root' })
export class ModalService {
      public readonly applicationRef: ApplicationRef;

      public constructor() {
            this.applicationRef = inject(ApplicationRef);
      }

      public create<T, K>(params: {
            component: Type<T>;
            params?: Record<string, K>;
            title: string;
            width?: string;
            height?: string;
            submitDisabled?: boolean;
            closeDisabled?: boolean;
      }) {
            const { title, width, height, component, closeDisabled, submitDisabled } = params;

            const rootComponent = this.applicationRef.components.at(0);
            rootComponent?.location.nativeElement.classList.add('blur');

            const rootComponentViewContainer = rootComponent!.injector.get(ViewContainerRef);

            const modalComponentRef = rootComponentViewContainer?.createComponent(ModalComponent);

            const modalViewContainer = modalComponentRef?.location.nativeElement.querySelector('.main');

            const injectedComponentRef = rootComponentViewContainer?.createComponent(component);

            const modalComponentMetadata = reflectComponentType(ModalComponent);
            const injectedComponentRefMetadata = reflectComponentType(component);

            for (const input of modalComponentMetadata!.inputs) {
                  if (input.propName === 'title') {
                        modalComponentRef.instance.title = title;
                  }

                  if (input.propName === 'disableCancel') {
                        modalComponentRef.instance.disableCancel = !!closeDisabled;
                  }

                  if (input.propName === 'disableSubmit') {
                        modalComponentRef.instance.disableSubmit = !!submitDisabled;
                  }
            }

            for (const input of injectedComponentRefMetadata!.inputs) {
                  if (input.propName === 'modalInstance') {
                        injectedComponentRef.setInput('modalInstance', modalComponentRef.instance);
                  }

                  if (params.params && params.params[input.propName]) {
                        injectedComponentRef.setInput(input.propName, params.params[input.propName]);
                  }
            }

            modalComponentRef.location.nativeElement.setAttribute('style', `width: ${width}; height: ${height}`);

            modalViewContainer.appendChild(injectedComponentRef!.location.nativeElement);
      }
}
