import { ApplicationRef, ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { NotificationComponent } from '../../components';


@Injectable({ providedIn: 'root' })
export class NotificationService {

      private readonly applicationRef: ApplicationRef;

      public constructor() {
            this.applicationRef = inject(ApplicationRef);
      }

      public success(message: string, delay: number = 3000) {
            const componentRef = this.create(faCheckCircle, 'success', 'Success', message);
            this.hide(componentRef, delay);
      }

      public error(message: string, delay: number = 3000) {
            const componentRef = this.create(faExclamationCircle, 'error', 'Error', message);
            this.hide(componentRef, delay);
      }

      private create(icon: IconDefinition, type: 'success' | 'error', title: string, message: string) {
            const container = this.applicationRef.components[0].injector.get(ViewContainerRef);
            const notificationRef = container.createComponent(NotificationComponent);
            notificationRef.setInput('icon', icon);
            notificationRef.setInput('type', type);
            notificationRef.setInput('title', title);
            notificationRef.setInput('message', message);
            return notificationRef;
      }

      private hide(componentRef: ComponentRef<NotificationComponent>, delay: number) {
            const timeoutRef = setTimeout(() => {
                  componentRef.destroy();
                  clearTimeout(timeoutRef);
            }, delay);
      }
}
