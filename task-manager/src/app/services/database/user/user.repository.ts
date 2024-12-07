import { Observable } from 'rxjs';

import { User } from 'src/app/models';
import { CrudRepository } from '../../crud-repository.interface';

export interface UserRepository extends CrudRepository<User, string, 'id'> {
      findByEmailAndPassword(email: string, password: string): Observable<User>;
}
