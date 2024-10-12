import moment from "moment";
import { Observable } from "rxjs";

export class TimeInterval extends Observable<number> {
      public constructor(
            private readonly delay: number,
      ) {
            super((subscriber) => {
                  let value = 0;
                  const intervalId = setInterval(() => {
                        if (moment().seconds() < 40) {
                              subscriber.next(value++);
                        } else {
                              clearInterval(intervalId);
                              subscriber.complete();
                        }
                  }, this.delay);
            });
      }
}
