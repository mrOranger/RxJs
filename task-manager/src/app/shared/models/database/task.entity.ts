import { Entity } from "dexie";
import { DatabaseService } from "../../services";
import { TaskStatus } from "../../enums";

export class TaskEntity extends Entity<DatabaseService> {
      public id!: string;
      public title!: string;
      public description!: string;
      public status!: TaskStatus;
      public createdAt!: Date;
      public updatedAt!: Date;
}
