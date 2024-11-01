import { Observable, delay, of, switchMap, timestamp } from 'rxjs';

type ClickEvent = {
      x: number;
      y: number;
};

const click$ = new Observable<ClickEvent>((subscription) => {
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.complete();
});

click$.pipe(
      switchMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) =>
            console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log('Completed!'),
});

const delayClick$ = new Observable<ClickEvent>((subscription) => {
      const timeOutRef1 = setTimeout(() => {
            subscription.next({ x: Math.random(), y: Math.random() });
            clearTimeout(timeOutRef1);
      }, 1000);

      const timeOutRef2 = setTimeout(() => {
            subscription.next({ x: Math.random(), y: Math.random() });
            clearTimeout(timeOutRef2);
      }, 4000);

      const timeOutRef3 = setTimeout(() => {
            subscription.next({ x: Math.random(), y: Math.random() });
            subscription.complete();
            clearTimeout(timeOutRef3);
      }, 8000);
});

delayClick$
      .pipe(
            switchMap((x) => of(x).pipe(delay(1000))),
            timestamp(),
      )
      .subscribe({
            next: ({ timestamp, value }) =>
                  console.log(`(delay) - [${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
            complete: () => console.log('Completed!'),
      });
