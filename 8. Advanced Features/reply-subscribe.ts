import { from } from "rxjs";
import { TimeInterval } from "./time-interval.observable";

let counter = 0;

const replay$ = from(new Promise((resolve, reject) => {

      setTimeout(() => {
            if (counter === 0) {
                  counter++;
                  return resolve('Success.');
            }
            return reject('Error.');
      }, 2000);

}));

replay$.subscribe({ next: (message) => console.log(message), });
replay$.subscribe({ next: (message) => console.log(message), });

const resubscribe$ = new TimeInterval(1000);

resubscribe$.subscribe({ next: (value) => console.log(`Observer 1 observes: ${value}`), });
setTimeout(() => resubscribe$.subscribe({ next: (value) => console.log(`Observer 2 observes: ${value}`), }), 5000)
