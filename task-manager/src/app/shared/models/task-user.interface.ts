import { Entity } from "dexie";

export interface TaskUser extends Entity {
      id: string;
      userId: string;
      taskId: string;
}
