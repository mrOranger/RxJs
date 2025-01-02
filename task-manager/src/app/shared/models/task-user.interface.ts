import { Entity } from "./entity.interface";

export interface TaskUser extends Entity {
      id: string;
      userId: string;
      taskId: string;
}
