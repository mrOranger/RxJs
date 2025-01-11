import { Injectable } from '@angular/core';
import { StoreCollectionService } from '../store-collection.service';
import { ProjectTask } from '../../models';

@Injectable({ providedIn: 'root' })
export class StoreProjectTaskService extends StoreCollectionService<ProjectTask> {
      public constructor() {
            super();
      }
}
