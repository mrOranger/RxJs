import { filter, from, interval, map, share } from "rxjs";

const hotIntervaL$ = interval(1000).pipe(
      map(() => Math.random()),
      share(),
);

hotIntervaL$.subscribe({ next: (value) => console.log(`Observer 1 - ${value}`), });
setTimeout(() => hotIntervaL$.subscribe({ next: (value) => console.log(`Observer 2 - ${value}`), }), 2000);
hotIntervaL$.subscribe({ next: (value) => console.log(`Observer 3 - ${value}`), });


const from$ = from([1, 2, 3, 4, 5]).pipe(
      filter((value) => value % 2 === 0),
      share(),
);

from$.subscribe({ next: (value) => console.log(`Observer 1 - ${value}`), });
setTimeout(() => from$.subscribe({ next: (value) => console.log(`Observer 2 - ${value}`), }), 2000);
