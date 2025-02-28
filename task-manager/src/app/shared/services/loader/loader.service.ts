import { ApplicationRef, ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from '../../components';

@Injectable({ providedIn: 'root' })
export class LoaderService {
      private componentRef: ComponentRef<LoaderComponent> | null;
      private readonly applicationRef: ApplicationRef;

      public constructor() {
            this.componentRef = null;
            this.applicationRef = inject(ApplicationRef);
      }

      public start(text?: string): void {
            const timeoutRef = setTimeout(() => {
                  const container = this.applicationRef.components[0].injector.get(ViewContainerRef);
                  const loaderComponentRef = container.createComponent(LoaderComponent);
                  loaderComponentRef.instance.label = text;
                  this.componentRef = loaderComponentRef;
                  clearTimeout(timeoutRef);
            }, 100);
      }

      public stop(): void {
            const timeoutRef = setTimeout(() => {
                  if (this.componentRef !== null) {
                        this.componentRef?.destroy();
                        this.componentRef = null;
                  }
                  clearTimeout(timeoutRef);
            }, 100);
      }

      public startAndStop(fn: () => void, message?: string) {
            this.start(message);
            fn();
            this.stop();
      }
}
