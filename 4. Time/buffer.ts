import { Observable, buffer, bufferCount, bufferTime, bufferWhen, interval, map } from 'rxjs';
import { users } from '../Database/users.database';

function createBuffer(intervalRange: number, closingObservable: Observable<any>, observerName: string) {
      interval(intervalRange)
            .pipe(buffer(closingObservable))
            .subscribe({
                  next: (value) => console.log(`${observerName} - [${value}]`),
            });
}

createBuffer(1000, interval(2000), 'Observer 1');
// createBuffer(1000, interval(500), 'Observer 2');

const bufferCount$ = interval(500)
      .pipe(
            bufferCount(5),
            map((values) => values.map((value) => value % users.length)),
            map((indexes) => indexes.map((index) => users[index]?.username)),
      );

bufferCount$.subscribe({
      next: (names) => console.log(`[Buffer Count] - [${names}]`),
})

interval(1000).pipe(
      bufferWhen(() => bufferCount$)
).subscribe({
      next: (value) => console.log(`[Buffer When] - [${value}]`),
});

interval(1000).pipe(
      bufferTime(5000)
).subscribe({
      next: (value) => console.log(`[Buffer Time] - [${value}]`),
});


