import { Entity } from './entity.interface';

export interface ProjectTask extends Entity {
      id: string;
      taskId: string;
      projectId: string;
}
