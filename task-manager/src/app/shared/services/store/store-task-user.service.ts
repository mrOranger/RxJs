import { Injectable } from '@angular/core';

import { TaskUser } from '../../models';
import { StoreCollectionService } from '../store-collection.service';

@Injectable({ providedIn: 'root' })
export class StoreTaskUserService extends StoreCollectionService<TaskUser> {
      public constructor() {
            super();
      }
}
