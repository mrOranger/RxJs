import moment from "moment";
import { Operations } from "./operations.subject";
import { OperationsType } from "./operations.type";
import { map, range } from "rxjs";

const aObserver = {
      next: (value: OperationsType) => console.log(`(aObserver) \t\t [${moment().format()}] - ${value}`),
      error: () => console.error(`(aObserver) \t [${moment().format()}] - an error occurred!`),
      complete: () => console.log(`(aObserver) \t [${moment().format()}] - closed`),
};

const anotherObserver = {
      next: (value: OperationsType) => console.log(`(anotherObserver) \t [${moment().format()}] - ${value}`),
      error: () => console.error(`(anotherObserver) \t[${moment().format()}] - an error occurred!`),
      complete: () => console.log(`(anotherObserver) \t[${moment().format()}] - closed`),
};

const aObserver$ = Operations.getInstance().subscribe(aObserver);


console.group('Starting first range');
range(0, Math.ceil(Math.random()*10)).pipe(
      map((number) => Math.ceil(Math.random() * number) % 4),
      map((number) => {
            switch(number) {
                  case 0: return 'GET';
                  case 1: return 'POST';
                  case 2: return 'PUT';
                  case 3: return 'DELETE';
                  default: throw new Error('Invalid operation');
            }
      })
).subscribe({
      next: (value) => Operations.getInstance().emit(value),
});
console.groupEnd();
console.log('Ending first range');


const anotherObserver$ = Operations.getInstance().subscribe(anotherObserver);

console.group('Starting second range');
range(0, Math.ceil(Math.random()*10)).pipe(
      map((number) => Math.ceil(Math.random() * number) % 4),
      map((number) => {
            switch(number) {
                  case 0: return 'GET';
                  case 1: return 'POST';
                  case 2: return 'PUT';
                  case 3: return 'DELETE';
                  default: throw new Error('Invalid operation');
            }
      })
).subscribe({
      next: (value) => Operations.getInstance().emit(value),
      complete: () => {
            aObserver$.unsubscribe();
            anotherObserver$.unsubscribe();
      },
});
console.groupEnd()
console.log('Ending second range');
