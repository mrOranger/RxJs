import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
      private readonly notificationType$: BehaviorSubject<'success' | 'error'>;
      private readonly notificationMessage$: BehaviorSubject<string>;
      private readonly notificationTitle$: BehaviorSubject<string>;
      private readonly notification$: BehaviorSubject<boolean>;

      public constructor() {
            this.notificationTitle$ = new BehaviorSubject<string>('');
            this.notificationMessage$ = new BehaviorSubject<string>('');
            this.notification$ = new BehaviorSubject<boolean>(false);
            this.notificationType$ = new BehaviorSubject<'success' | 'error'>('success');
      }

      public get type$() {
            return this.notificationType$;
      }

      public get show$() {
            return this.notification$;
      }

      public get title$() {
            return this.notificationTitle$;
      }

      public get message$() {
            return this.notificationMessage$;
      }

      public success(message: string, delay: number = 3000) {
            this.notificationType$.next('success');
            this.notificationMessage$.next(message);
            this.notificationTitle$.next('Success');
            this.notification$.next(true);
            this.hide(delay);
      }

      public error(message: string, delay: number = 3000) {
            this.notificationType$.next('error');
            this.notificationMessage$.next(message);
            this.notificationTitle$.next('Something went wrong');
            this.notification$.next(true);
            this.hide(delay);
      }

      private hide(delay: number) {
            const timeoutRef = setTimeout(() => {
                  this.notification$.next(false);
                  clearTimeout(timeoutRef);
            }, delay);
      }
}
