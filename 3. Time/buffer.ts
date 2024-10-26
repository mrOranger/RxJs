import { Observable, buffer, bufferCount, bufferTime, bufferWhen, filter, interval, map } from 'rxjs';
import { users } from '../Database/users.database';

interval(1000)
      .pipe(buffer(interval(2000)))
      .subscribe({
            next: (value) => console.log(`[${value}]`),
      });

interval(500)
      .pipe(
            bufferCount(5),
            map((values) => values.map((value) => value % users.length)),
            map((indexes) => indexes.map((index) => users[index]?.username)),
      )
      .subscribe({
            next: (names) => console.log(names),
      });

interval(1000)
      .pipe(bufferTime(5000))
      .subscribe({
            next: (value) => console.log(`[Buffer Time] - [${value}]`),
      });

const timeout$ = interval(2500);

interval(500)
      .pipe(
            map(() => Math.random() * 10),
            map((value) => Math.floor(users.length * value)),
            map((index) => users[index]),
            filter((user) => !!user?.name && user?.name.length > 10),
            map((user) => `${user?.name} (${user?.username})`),
            buffer(timeout$),
            filter((users) => users.length > 0),
            map((users) => users.reduce((acc, user) => acc.concat(user).concat('\n'), '')),
      )
      .subscribe({
            next: (usersList) => {
                  console.log(`List of users: \n${usersList}`);
            },
      });

interval(500).pipe(
      map(() => Math.random()),
      bufferWhen(() => randomEvent$()),
).subscribe({
      next: (value) => console.log(value),
});

function randomEvent$(timeout: number = (Math.random() * 1000)) {
      return new Observable((subscribe) => {
            const timeoutRef = setTimeout(() => {
                  subscribe.next('This is a random message');
                  subscribe.complete();
                  clearTimeout(timeoutRef);
            }, timeout);
      });
}
