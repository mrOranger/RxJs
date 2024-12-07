import { Component, inject } from '@angular/core';
import { faCheckCircle, faExclamationCircle, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';

@Component({
      selector: 'tm-notification',
      templateUrl: './notification.component.html',
      styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
      private readonly notificationService: NotificationService;

      public constructor() {
            this.notificationService = inject(NotificationService);
      }

      public get service() {
            return this.notificationService;
      }

      public get infoIcon() {
            if (this.notificationService.type$.value === 'error') {
                  return faExclamationCircle;
            }
            return faCheckCircle;
      }
}
