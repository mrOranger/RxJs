import { Injectable } from '@angular/core';

import { StoreService } from '../../store.service';

@Injectable({ providedIn: 'root' })
export class StorePasswordService extends StoreService<string> {
      public constructor() {
            super('');
      }
}
