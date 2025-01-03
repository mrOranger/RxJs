import { TaskStatus } from "../enums";
import { Entity } from "./entity.interface";

export interface Task extends Entity {
      id: string;
      title: string;
      description: string;
      status: TaskStatus;
}
