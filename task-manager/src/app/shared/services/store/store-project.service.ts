import { Injectable } from '@angular/core';
import { StoreCollectionService } from '../store-collection.service';
import { Project } from '../../models';

@Injectable({ providedIn: 'root' })
export class StoreProjectService extends StoreCollectionService<Project> {
      public constructor() {
            super();
      }
}
