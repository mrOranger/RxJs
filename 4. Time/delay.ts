import { delay, filter, from, map } from 'rxjs';

from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .pipe(
            delay(200),
            map((value) => value + 1),
            delay(200),
            map((value) => value + 1),
            delay(200),
            map((value) => value + 1),
            delay(200),
            map((value) => value + 1),
            filter((value) => value > 6),
      )
      .subscribe({
            next: (value) => console.log(value),
            complete: () => console.log('complete'),
      });
