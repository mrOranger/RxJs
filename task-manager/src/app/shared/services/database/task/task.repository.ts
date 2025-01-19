import { Task } from '../../../models';
import { CrudRepository } from '../crud-repository.interface';

import { Observable } from 'rxjs';

export interface TaskRepository extends CrudRepository<Task, string, 'id' | 'createdAt' | 'updatedAt'> {
      findByProjectId: (projectId: string) => Observable<Task[]>;
}
