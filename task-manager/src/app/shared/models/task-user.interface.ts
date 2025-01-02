import { Entity } from "dexie";

export interface TaskUser extends Entity {
      userId: string;
      taskId: string;
}
