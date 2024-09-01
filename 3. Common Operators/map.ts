import { from, map } from 'rxjs';
import { User } from '../Database/user.interface';
import { users } from '../Database/users.database';
import { UserObserver } from './user.observer';

from(users)
      .pipe(map((user: User, index: number) => `${index} - [${user.id}] ${user.name}`))
      .subscribe(new UserObserver(0, ''));