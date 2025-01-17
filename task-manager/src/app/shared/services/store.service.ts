import { BehaviorSubject, PartialObserver, Subscription } from 'rxjs';

export abstract class StoreService<T> {
      protected readonly behaviorSubject: BehaviorSubject<T>;

      public constructor(initialValue: T) {
            this.behaviorSubject = new BehaviorSubject<T>(initialValue);
      }

      public subscribe(observer: PartialObserver<T>) {
            return this.behaviorSubject.subscribe(observer);
      }

      public get subject$() {
            return this.behaviorSubject.asObservable();
      }

      public get value() {
            return this.behaviorSubject.value;
      }

      public set value(value: T) {
            this.behaviorSubject.next(value);
      }

      public unsubscribe(subscription?: Subscription) {
            if (!subscription?.closed) {
                  subscription?.unsubscribe();
            }
      }
}
