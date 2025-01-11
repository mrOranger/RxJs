import { Entity } from 'dexie';
import { DatabaseService } from '../../services';

export class ProjectEntity extends Entity<DatabaseService> {
      public id!: string;
      public title!: string;
      public description!: string;
      public ownerId!: string;
      public startingAt!: Date;
      public endingAt!: Date;
      public createdAt!: Date;
      public updatedAt!: Date;
}
