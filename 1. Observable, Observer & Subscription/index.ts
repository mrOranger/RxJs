import { Observable, from } from 'rxjs';
import { MakeHttpRequest } from './http-request.observable';
import { JsonFormatter } from './json-formatter.observer';

from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).subscribe({
      next: (value) => console.log(value),
      error: (error) => console.log(error),
      complete: () => console.log('complete'),
});

const observable = new Observable<number>((observer) => {
      let numberOfSeconds = 0;

      function emitValue() {
            let randomNumber = Math.random();

            if (numberOfSeconds > 4000 && randomNumber > 0.5) {
                  observer.error('Error.');
            }
            if (numberOfSeconds > 4000 && randomNumber <= 0.5) {
                  observer.complete();
            }

            observer.next(randomNumber);
            numberOfSeconds = numberOfSeconds + 1000;

            setTimeout(emitValue, 1000);
      }

      setTimeout(emitValue, 1000);
});

observable.subscribe({
      next: (value) => console.log(value),
      error: (error) => console.log(error),
      complete: () => console.log('complete'),
});

new MakeHttpRequest().subscribe(new JsonFormatter());
