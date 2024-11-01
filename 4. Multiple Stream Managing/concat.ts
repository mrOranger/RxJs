import { Observable, concat, concatWith, from, interval, map, of, range, take } from "rxjs";
import { users } from "../Database/users.database";

const interval$ = interval(200).pipe( take( Math.floor(Math.random() * 10 )));
const numbers$ = range(0, 10).pipe( map((value) => Math.random() * value) );

concat(interval$, numbers$).pipe(
      map((number) => number.toPrecision(2)),
).subscribe({
      next: (value) => console.log(value),
});

const firstNames$ = from(users).pipe(
      map((user) => `First Name: ${user.name}`),
      take(10),
);

const usernames$ = from(users).pipe(
      map((user) => `Username: ${user.username}`),
      take(10),
);

firstNames$.pipe(
      concatWith(usernames$),
).subscribe({
      next: (value) => console.log(value),
});


type ChatEvent = {
      source: string;
      message: string;
      timestamp: number;
};

const factoryChat = (sourceName: string, timeSpan = 1000) => new Observable<ChatEvent>((subscriber) => {
      let i = 0;
      const intervalRef = setInterval(() => {
            if (i == 9) {
                  subscriber.complete();
                  clearInterval(intervalRef);
            } else {
                  subscriber.next({ source: sourceName, message: `Message ${i+1}`, timestamp: Date.now() });
            }
            i++;
      }, timeSpan);
});

const first$ = factoryChat('Max');
const second$ = of({ source: 'Mary', message: 'Hey!', timestamp: Date.now()});

concat(first$, second$).pipe(
      map((event) => `[${event.source}] - ${event.message} - ${new Date(event.timestamp).toLocaleTimeString()}`),
).subscribe({
      next: (value) => console.log(value),
});

const aSequenceWithException = interval(1000).pipe(
      map((value) => {
            if (value > 10) {
                  throw new Error('Value is greater than 10!');
            }
            return value;
      }),
);

const aSequence = interval(500);

concat(aSequenceWithException, aSequence).subscribe({
      next: (value) => console.log(value),
      error: (error: Error) => console.log(error.message),
      complete: () => console.log('Sequence complete!'),
});
