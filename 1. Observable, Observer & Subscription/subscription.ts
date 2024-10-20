import { from } from "rxjs";

const aSubscription$ = from([1, 2, 3, 4]).subscribe({
      next: (value) => console.log(`First Observable emits - ${value}`),
});

const anotherSubscription$ = from([5, 6, 7, 8]).subscribe({
      next: (value) => console.log(`Second Observable emits - ${value}`),
});

aSubscription$.unsubscribe();
anotherSubscription$.unsubscribe();
