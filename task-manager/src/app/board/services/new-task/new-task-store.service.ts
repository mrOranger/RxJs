import { Injectable } from '@angular/core';
import { StoreService, Task } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class NewTaskStoreService extends StoreService<Partial<Task | null>> {

      public constructor() {
            super(null);
      }

}
