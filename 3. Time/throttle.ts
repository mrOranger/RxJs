import moment from "moment";
import { interval, map, throttle, throttleTime, timer } from "rxjs";

const firstSource$ = interval(1000).pipe(
      map((value) => Math.ceil(Math.random() * value)),
      map((value) => `[${moment().format()}] ${value}`)
);

const secondSource$ = timer(2000).pipe(
      map((value) => Math.ceil(Math.random() * value)),
      map((value) => `[${moment().format()}] ${value}`)
);

firstSource$.pipe(
      throttle(() => secondSource$)
).subscribe({
      next: (value) => console.log(value),
});

const names$ = interval(1000).pipe(
      map((number) => ['Mario', 'Francesca', 'Edoardo', 'Antonella'].at(number % 4))
);

names$.pipe(
      throttleTime(500),
).subscribe({
      next: (name) => console.log(`[${moment().format('hh:mm.ss')}] - a new name has been emitted ${name}`)
});
