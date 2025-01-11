import { Entity } from './entity.interface';

export interface Project extends Entity {
      id: string;
      title: string;
      description: string;
      ownerId: string;
      startingAt: Date;
      endingAt: Date;
}
