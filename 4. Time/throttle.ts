import { interval, map, throttleTime } from 'rxjs';
import { users } from '../Database/users.database';

function run(intervalEmission: number, throttlingTime: number, runningName: string) {
      interval(intervalEmission)
            .pipe(
                  map((_) => Math.floor(Math.random() * users.length)),
                  map((index) => users[index]),
                  throttleTime(throttlingTime),
                  map((user) => `[${runningName}] - ${user?.name}`),
            )
            .subscribe({
                  next: (user) => console.log(user),
            });
}

run(1000, 500, 'Throttle 1'); // Will work !
run(1000, 2000, 'Throttle 2'); // Will work
