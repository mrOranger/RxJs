import { Entity } from "dexie";
import { DatabaseService } from "../../services";

export class TaskEntity extends Entity<DatabaseService> {
      public id!: string;
      public title!: string;
      public description!: string;
      public createdAt!: Date;
      public updatedAt!: Date;
}
