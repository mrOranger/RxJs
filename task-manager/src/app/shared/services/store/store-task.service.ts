import { Injectable } from '@angular/core';

import { Task } from '../../models';
import { StoreCollectionService } from '../store-collection.service';

@Injectable({ providedIn: 'root' })
export class StoreTaskService extends StoreCollectionService<Task> {
      public constructor() {
            super();
      }
}
