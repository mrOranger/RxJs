import { Observable, concatMap, delay, of, timestamp } from "rxjs";

type ClickEvent = {
      x: number;
      y: number;
}

const click$ = new Observable<ClickEvent>((subscription) => {
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.complete();
});

click$.pipe(
      concatMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log("Completed!"),
});
