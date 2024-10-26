import { delay, from, of, timeout } from "rxjs";
import { users } from "../Database/users.database";

from([1, 2, 3, 4]).pipe(
      delay(5000),
      timeout(1000),
).subscribe({
      next: (value) => console.log(`Received value: ${value}`),
      error: () => console.error('Timeout!'),
      complete: () => console.log('Completed'),
});

const randomUser = users.at(Math.ceil(users.length * Math.random()));

of(randomUser).pipe(
      delay(500),
      timeout(1000),
).subscribe({
      next: (user) => console.log(`Received value: ${user?.name} ${user?.username}`),
      error: () => console.error('Timeout!'),
      complete: () => console.log('Completed'),
});
