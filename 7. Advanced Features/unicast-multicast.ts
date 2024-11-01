import { Observable, Subscriber } from "rxjs";

class Producer {

      private event: number = 0;
      private readonly observers: Subscriber<number>[] = [];

      public constructor() {
            setInterval(() => {
                  this.observers.forEach((observer) => observer.next(this.event));
                  this.event++;
            }, 1000);
      }

      public register(observer: Subscriber<number>) {
            this.observers.push(observer);
      }
}

const producer$ = new Producer();

class HotObservable extends Observable<number> {

      public constructor() {
            super((observer) => {
                  producer$.register(observer);
            });
      }
}

class ColdObservable extends Observable<number> {

      public constructor() {
            super((observer) => {
                  const producer$ = new Producer();
                  producer$.register(observer);
            });
      }
}

const hot$ = new HotObservable();
const cold$ = new ColdObservable();

hot$.subscribe({
      next: (value) => console.log(`Hot Observable 1 - ${value}`),
});

setTimeout(() => {
      hot$.subscribe({
            next: (value) => console.log(`Hot Observable 2 - ${value}`),
      });
}, 5000);


cold$.subscribe({
      next: (value) => console.log(`Cold Observable 1 - ${value}`),
});

setTimeout(() => {
      cold$.subscribe({
            next: (value) => console.log(`Cold Observable 2 - ${value}`),
      });
}, 5000);
