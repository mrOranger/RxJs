import moment from "moment";
import { from, fromEvent, of } from "rxjs";
import { EventEmitter } from 'node:events';

type Data = {
      date: string;
      value: number;
}


of({ date: moment().format(), value: Math.random()}).subscribe({
      next: ({ date, value }: Data) => console.log(`(Sync - Single Value) [${date}] - ${value}`),
});

const dataPromise = new Promise<Data>((resolve, _) => {
      setTimeout(() => resolve({ date: moment().format(), value: Math.random()}), 1000*Math.random());
});

from(dataPromise).subscribe({
      next: ({ date, value }: Data) => console.log(`(Async - Single Value) [${date}] - ${value}`),
});

function* multipleSync<T>(elems: T[]) {
      for (const value of elems) {
            yield value;
      }
}

from(multipleSync<Data>([
      {
            date: moment().subtract(Math.floor(Math.random()), 'days').format(),
            value: Math.random(),
      },
      {
            date: moment().subtract(Math.floor(Math.random()), 'days').format(),
            value: Math.random(),
      },
      {
            date: moment().subtract(Math.floor(Math.random()), 'days').format(),
            value: Math.random(),
      },
      {
            date: moment().subtract(Math.floor(Math.random()), 'days').format(),
            value: Math.random(),
      }
])).subscribe({
      next: ({ date, value }: Data) => console.log(`(Sync - Multiple Value) [${date}] - ${value}`),
});

const multipleAsync = new EventEmitter();

fromEvent(multipleAsync, 'number').subscribe({
      next: (event) => console.log(`(Async - Multiple Value) ${event}`),
})

multipleAsync.emit('number', 1);
multipleAsync.emit('number', 1);
setTimeout(() => multipleAsync.emit('number', 3), 1000);
multipleAsync.emit('number', 2);
