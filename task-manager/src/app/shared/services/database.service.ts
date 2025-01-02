import { Injectable } from '@angular/core';

import Dexie, { EntityTable } from 'dexie';

import { TaskEntity, TaskUserEntity, UserEntity } from '../models';

@Injectable()
export class DatabaseService extends Dexie {
      public readonly users!: EntityTable<UserEntity, 'id'>;
      public readonly tasks!: EntityTable<TaskEntity, 'id'>;
      public readonly taskUser!: EntityTable<TaskUserEntity, 'id'>;

      public constructor() {
            super('TaskManagerDB');

            this.version(1).stores({
                  users: 'id, firstName, lastName, &email, [email+password], createdAt, updatedAt',
                  tasks: 'id, title, description, assignedTo, createdAt, updatedAt',
                  taskUser: 'id, userId, taskId, createdAt, updatedAt',
            });

            this.users.mapToClass(UserEntity);
            this.tasks.mapToClass(TaskEntity);
            this.taskUser.mapToClass(TaskUserEntity);

      }
}
