import { ApplicationRef, ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { NotificationComponent } from '../../components';


@Injectable({ providedIn: 'root' })
export class NotificationService {

      private readonly activeNotifications: ComponentRef<NotificationComponent>[];
      private readonly activeTimeouts: NodeJS.Timeout[];
      private readonly applicationRef: ApplicationRef;

      public constructor() {
            this.activeTimeouts = [];
            this.activeNotifications = [];
            this.applicationRef = inject(ApplicationRef);
      }

      public success(message: string, delay: number = 3000) {
            this.clear();
            const componentRef = this.create(faCheckCircle, 'success', 'Success', message);
            this.hide(componentRef, delay);
      }

      public error(message: string, delay: number = 3000) {
            this.clear();
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


      private clear() {
            this.clearActiveNotifications();
            this.clearActiveTimeouts();
      }

      private clearActiveTimeouts() {
            for (const notification of this.activeNotifications) {
                  notification.destroy();
            }
            this.activeNotifications.splice(0, this.activeNotifications.length);
      }

      private clearActiveNotifications() {
            for (const timeout of this.activeTimeouts) {
                  clearTimeout(timeout);
            }
            this.activeTimeouts.splice(0, this.activeTimeouts.length);
      }

      private hide(component: ComponentRef<NotificationComponent>, delay: number) {
            const timeoutRef = setTimeout(() => {
                  component.destroy();
                  clearTimeout(timeoutRef);
            }, delay);
            this.activeNotifications.push(component);
            this.activeTimeouts.push(timeoutRef);
      }
}
