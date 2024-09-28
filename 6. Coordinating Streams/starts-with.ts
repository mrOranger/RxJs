import { from, startWith } from "rxjs";

from([1, 2, 3, 4, 5]).pipe(
      startWith(...Array(10).fill(0).map((value, index) => value - index).sort((first, second) => first - second)),
).subscribe({
      next: (value: number) => console.log(value),
      error: (err) => console.error(err),
      complete: () => console.log('Complete'),
});
