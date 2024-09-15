import { concat, interval, map, range, take } from "rxjs";

const interval$ = interval(200).pipe( take( Math.floor(Math.random() * 10 )));
const numbers$ = range(0, 10).pipe( map((value) => Math.random() * value) );

concat(interval$, numbers$).pipe(
      map((number) => number.toPrecision(2)),
).subscribe({
      next: (value) => console.log(value),
});