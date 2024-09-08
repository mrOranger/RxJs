import { debounceTime, interval, map } from 'rxjs';
import { users } from '../Database/users.database';

function run(intervalEmission: number, debouncingTime: number, runningName: string) {
      interval(intervalEmission)
            .pipe(
                  map((_) => Math.floor(Math.random() * users.length)),
                  map((index) => users[index]),
                  debounceTime(debouncingTime),
                  map((user) => `[${runningName}] - ${user?.name}`),
            )
            .subscribe({
                  next: (user) => console.log(user),
            });
}

run(1000, 500, 'Debounce 1'); // Will work !
run(1000, 2000, 'Debounce 2'); // Won't work