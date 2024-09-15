import { distinctUntilChanged, filter, from, map } from 'rxjs';
import { User } from '../Database/user.interface';
import { users } from '../Database/users.database';

function predicate(user: User) {
      return user.company.name === 'Keebler LLC';
}

from(users)
      .pipe(
            filter(predicate),
            map((user: User, index: number) => `${index} - [${user.id}] ${user.name}`),
      )
      .subscribe({
            next: (user) => console.log(user),
            error: (err) => console.error(err),
            complete: () => console.log('Stream closed.'),
      });

from(users).pipe(
      map((user) => user.username),
      distinctUntilChanged(),
).subscribe({
      next: (value) => console.log(value),
});
