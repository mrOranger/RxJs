import { Entity } from "dexie";
import { DatabaseService } from "../../services";

export class TaskUserEntity extends Entity<DatabaseService>{
      public id!: string;
      public userId!: string;
      public taskId!: string;
}
