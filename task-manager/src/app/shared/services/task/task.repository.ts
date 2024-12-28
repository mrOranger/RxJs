import { Task } from "../../models";
import { CrudRepository } from "../crud-repository.interface";

export interface TaskRepository extends CrudRepository<Task, string, 'id' | 'createdAt' | 'updatedAt'>{
}
