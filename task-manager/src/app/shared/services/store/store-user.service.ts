import { Injectable } from '@angular/core';

import { User } from '../../models';
import { StoreCollectionService } from '../store-collection.service';

@Injectable({ providedIn: 'root' })
export class StoreUserService extends StoreCollectionService<User> {
      public constructor() {
            super();
      }
}
