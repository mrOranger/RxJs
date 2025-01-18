import { Injectable } from '@angular/core';

import { StoreService } from '../../store.service';
import { Project } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class StoreSelectedProjectService extends StoreService<Project | null> {
      public constructor() {
            super(null);
      }

      public set select(project: Project) {
            this.value = project;
      }
}
