import { Project } from 'src/app/shared/models';
import { CrudRepository } from '../crud-repository.interface';

export interface ProjectRepository extends CrudRepository<Project, string, 'id' | 'createdAt' | 'updatedAt'> {}
