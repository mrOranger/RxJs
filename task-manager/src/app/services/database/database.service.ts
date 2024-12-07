import { Injectable } from '@angular/core';

import Dexie, { EntityTable } from 'dexie';

import { UserEntity } from 'src/app/models/database/user.entity';

@Injectable()
export class DatabaseService extends Dexie {
      public readonly users!: EntityTable<UserEntity, 'id'>;

      public constructor() {
            super('TaskManagerDB');

            this.version(1).stores({
                  users: 'id, firstName, lastName, [email+password], createdAt, updatedAt',
            });

            this.users.mapToClass(UserEntity);
      }
}
