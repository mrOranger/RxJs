import { inject, Injectable } from '@angular/core';
import { StoreEmailService } from './store-email.service';
import { StorePasswordService } from './store-password.service';

@Injectable({ providedIn: 'root' })
export class StoreLoginFactoryService {
      private readonly storeEmailService: StoreEmailService;
      private readonly storePasswordService: StorePasswordService;

      public constructor() {
            this.storeEmailService = inject(StoreEmailService);
            this.storePasswordService = inject(StorePasswordService);
      }

      public get email$() {
            return this.storeEmailService;
      }

      public get password$() {
            return this.storePasswordService;
      }
}
