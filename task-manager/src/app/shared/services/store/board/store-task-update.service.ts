import { Task } from 'src/app/shared/models';
import { StoreService } from '../../store.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StoreTaskUpdateService extends StoreService<Task | null> {
      public constructor() {
            super(null);
      }

      public get subject$() {
            return this.behaviorSubject;
      }
}
