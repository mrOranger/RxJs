import { delay, from, map } from 'rxjs';

from([1, 2, 3, 4, 5])
      .pipe(
            delay(1000),
            map((value) => value + 1),
            delay(1000),
            map((value) => value + 1),
      )
      .subscribe({
            next: (value) => console.log(value),
            complete: () => console.log('complete'),
      });
