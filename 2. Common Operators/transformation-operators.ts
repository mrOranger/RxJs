import { from, map, pairwise } from 'rxjs';
import { users } from '../Database/users.database';
import { User } from '../Database/user.interface';

type UserWithUsername = {
      id: number;
      name: string;
};

from(users)
      .pipe(
            map<User, UserWithUsername>((user) => ({
                  id: user.id,
                  name: `${user.name} (${user.username})`,
            })),
      )
      .subscribe({
            next: (user) => console.log(user),
      });

from(users)
      .pipe(
            map<User, UserWithUsername>((user) => ({
                  id: user.id,
                  name: `${user.name} (${user.username})`,
            })),
            pairwise(),
      )
      .subscribe({
            next: ([first, second]) => console.log(`[${first.name}] will play against [${second.name}]`),
      });
