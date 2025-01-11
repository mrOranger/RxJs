import { Entity } from 'dexie';

import { DatabaseService } from '../../services';

export class ProjectTaskEntity extends Entity<DatabaseService> {
      public id!: string;
      public taskId!: string;
      public projectId!: string;
      public createdAt!: Date;
      public updatedAt!: Date;
}
