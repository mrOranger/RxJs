import { interval, map } from 'rxjs';

function streamLimit (limit: number) {
      const standardizedLimit = ((limit - Math.random()) / limit);
      return interval(500).pipe(
            map(() => parseFloat((Math.random()).toPrecision(2))),
            map((value) => {
                  if (value > standardizedLimit ) {
                        throw new Error(`${value} is not a valid number for limit ${standardizedLimit}!`);
                  }
                  return value;
            })
      ).subscribe({
            next: (value) => console.log(`A new value is emitted - ${value}`),
            error: (exception) => console.error(exception),
            complete: () => console.log(`The stream has been closed!`),
      });
}

streamLimit(1);
