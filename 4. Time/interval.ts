import { interval, map } from 'rxjs';
import { users } from '../Database/users.database';

interval(Math.random() * 1000)
      .pipe(
            map(() => Math.floor(Math.random() * users.length)),
            map((index) => users[index]),
            map((user) => user?.name),
      )
      .subscribe({
            next: (value) => console.log(value),
            error: (err) => console.error(err),
            complete: () => console.log('complete'),
      });
