import { filter, interval, map, using } from "rxjs";

class DisposableResource {
      private isDisposed: boolean;

      public constructor() {
            this.isDisposed = false;
      }

      public unsubscribe() {
            if (!this.isDisposed) {
                  this.isDisposed = true;
                  console.log("The stream has been closed!");
            }
      }
}

const inputResource$ = interval(500).pipe(
      map((value) => Math.random() * value),
      filter((value) => value < 0.5),
);

const disposableObservable$ = using(
      () => new DisposableResource(),
      () => {
            console.log('The stream is going to emit values');
            return inputResource$
      },
);

const disposableSubscription$ = disposableObservable$.subscribe({
      next: (value) => console.log(value),
      error: (err) => console.error(err),
});

setTimeout(() => disposableSubscription$.unsubscribe(), 5000);
