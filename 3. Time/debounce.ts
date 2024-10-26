import moment from "moment";
import { debounce, debounceTime, from, interval, map, timer } from "rxjs";

from(['Mario', 'Maria', 'Federico', 'Federica']).pipe(
      debounce(() => timer(1000)),
).subscribe({
      next: (name) => console.log(`Hi! I'm ${name}`),
});

interval(1000).pipe(
      debounce((value) => timer(value * 200)),
      map((value) => ({ timestamp: moment().toISOString(), value })),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${timestamp}] : ${value}`),
});

from(['Mario', 'Maria', 'Federico', 'Federica']).pipe(
      debounceTime(1000),
).subscribe({
      next: (name) => console.log(`Hi! I'm ${name}`),
});

interval(1000).pipe(
      debounceTime(2000),
      map((value) => ({ timestamp: moment().toISOString(), value })),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${timestamp}] : ${value}`),
});
