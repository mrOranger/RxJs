import { isDevMode } from '@angular/core';

import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

import { user } from './schemas/v0';

export function initDatabase() {
      if (isDevMode()) {
            import('rxdb/plugins/dev-mode')
                  .then((module) => addRxPlugin(module.RxDBDevModePlugin))
                  .then(() =>
                        createRxDatabase({
                              name: 'todo-task',
                              storage: getRxStorageDexie(),
                              password: 'MySuperSecurePassword',
                              multiInstance: true,
                              eventReduce: true,
                        }),
                  )
                  .then((database) => {
                        console.log('Database created successfully!');
                        database.addCollections({
                              users: { schema: user },
                        });
                  });
      }
}
