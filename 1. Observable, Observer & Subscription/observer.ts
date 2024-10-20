import moment from "moment";
import { Observer, from } from "rxjs";

class CustomObserver implements Observer<number> {

      public constructor(
            private readonly name: string,
      ) { }

      public next(value: number) {
            const currentTimestamp = moment().format();
            console.log(`${this.name} [${currentTimestamp}] - event: ${value}`);
      }

      public error () {
            console.error('An error occurred');
      }

      public complete () {
            console.log('No more events');
      }

}

from([1, 2, 3, 4, 5, 6, 7, 8, 9]).subscribe(
      new CustomObserver('Custom Observer')
)
