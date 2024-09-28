import { finalize, range } from "rxjs";

range(1, 100).pipe(
      finalize(() => console.log('the stream is going to be closed ...')),
).subscribe({
      next: (value: number) => console.log(value),
      error: (err) => console.error(err),
      complete: () => console.log('Complete'),
});
