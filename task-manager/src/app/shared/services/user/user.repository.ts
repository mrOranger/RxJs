import { Observable } from 'rxjs';

import { User } from 'src/app/shared/models';
import { CrudRepository } from '../crud-repository.interface';

export interface UserRepository extends CrudRepository<User, string, 'id' | 'createdAt' | 'updatedAt'> {
      findByEmail(email: string): Observable<User>;
      findByEmailAndPassword(email: string, password: string): Observable<User>;
      attach(userId: string, taskId: string): Observable<User>    ;
}
