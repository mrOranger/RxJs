import { Injectable } from '@angular/core';

import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

import { from, Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
      private databaseInstance?: RxDatabase;

      private constructor() {
            addRxPlugin(RxDBDevModePlugin);
      }

      public initDatabase(): Observable<RxDatabase> {
            if (!this.databaseInstance) {
                  return from(
                        createRxDatabase({
                              name: 'todo-task',
                              storage: getRxStorageDexie(),
                              password: 'MySuperSecurePassword',
                              eventReduce: true,
                        }),
                  );
            }
            return of(this.databaseInstance);
      }

      public destroyDatabase() {
            if (this.databaseInstance) {
                  return from(this.databaseInstance.destroy());
            }
            return of(false);
      }

      public get database() {
            return this.databaseInstance;
      }
}
