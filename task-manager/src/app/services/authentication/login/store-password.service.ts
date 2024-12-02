import { Injectable } from '@angular/core';

import { StoreService } from '../../store.service';

@Injectable()
export class StorePasswordService extends StoreService<string> {
      public constructor() {
            super('');
      }
}
