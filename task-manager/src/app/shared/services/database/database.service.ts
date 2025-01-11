import { Injectable } from '@angular/core';

import Dexie, { EntityTable } from 'dexie';
import {
      ProjectEntity,
      ProjectTaskEntity,
      ProjectUserEntity,
      TaskEntity,
      TaskUserEntity,
      UserEntity,
} from '../../models';

@Injectable()
export class DatabaseService extends Dexie {
      public readonly users!: EntityTable<UserEntity, 'id'>;
      public readonly tasks!: EntityTable<TaskEntity, 'id'>;
      public readonly projects!: EntityTable<ProjectEntity, 'id'>;

      public readonly taskUser!: EntityTable<TaskUserEntity, 'id'>;
      public readonly projectTask!: EntityTable<ProjectTaskEntity, 'id'>;
      public readonly projectUser!: EntityTable<ProjectUserEntity, 'id'>;

      public constructor() {
            super('TaskManagerDB');

            this.version(1).stores({
                  users: 'id, firstName, lastName, &email, [email+password], createdAt, updatedAt',
                  tasks: 'id, title, description, status, createdAt, updatedAt',
                  taskUser: 'id, userId, taskId, createdAt, updatedAt',
                  projects: 'id, title, description, ownerId, startingAt, endingAt, createdAt, updatedAt',
                  projectUser: 'id, projectId, userId, createdAt, updatedAt',
                  projectTask: 'id, projectId, taskId, createdAt, updatedAt',
            });

            this.users.mapToClass(UserEntity);
            this.tasks.mapToClass(TaskEntity);
            this.taskUser.mapToClass(TaskUserEntity);
            this.projectTask.mapToClass(ProjectTaskEntity);
            this.projectUser.mapToClass(ProjectUserEntity);
      }
}
