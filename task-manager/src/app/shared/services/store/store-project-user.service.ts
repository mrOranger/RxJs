import { Injectable } from '@angular/core';
import { StoreCollectionService } from '../store-collection.service';
import { ProjectUser } from '../../models';

@Injectable({ providedIn: 'root' })
export class StoreProjectUserService extends StoreCollectionService<ProjectUser> {
      public constructor() {
            super();
      }
}
