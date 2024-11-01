import { Observable, delay, map, mergeMap, of, timestamp } from 'rxjs';

type ClickEvent = {
      x: number;
      y: number;
};

type HttpResponse = {
      status: 200;
      message: string;
};

const click$ = new Observable<ClickEvent>((subscription) => {
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.complete();
});

click$.pipe(
      mergeMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) =>
            console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log('Completed!'),
});

const http$ = new Observable<HttpResponse>((subscription) => {
      const timeoutRef = setTimeout(() => {
            subscription.next({ status: 200, message: 'OK' });
            clearTimeout(timeoutRef);
            subscription.complete();
      }, 1000);
});

click$.pipe(
      mergeMap(() => http$),
      timestamp(),
      map(({ timestamp, value }) => ({ timestamp: new Date(timestamp).toISOString(), value })),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${timestamp}] - ${value.message}`),
});
