import { Entity } from 'dexie';

import { DatabaseService } from '../../services';

export class ProjectUserEntity extends Entity<DatabaseService> {
      public id!: string;
      public userId!: string;
      public projectId!: string;
}
