import { Entity } from './entity.interface';

export interface ProjectUser extends Entity {
      id: string;
      userId: string;
      projectId: string;
}
