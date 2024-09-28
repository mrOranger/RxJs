# Coordinating Streams
In the previous chapter we saw how multiple streams can be combated creating a new stream containing results from each one. In this chapter, however, we are not interested in combining results from different stream, because we will focus only on the semantic meaning of streams combination, that is when a stream cause the execution of another and both results are combined in a single one; in other words, when two streams cooperate to achieve the same goal.

## Observable's `lifecycle`
Previously, we saw that an Observer is no more than an object containing three functions `next`, `error` and `complete`, together with the `subscribe` function they represent the lifecycle of an Observable, that is:

* The Observable starts to emit values (`subscribe` is invoked).
* A new value is detected and the Observable is working (`next` function).
* The Observable is stopped, because an error occurs or the stream is closed (`complete` or `error`).

Starting with the first event, that is the subscription of an Observer to the Observable, `startsWith` appends a specified value in the stream's beginning. In a certain way, `startsWith` is a sort of `concat` in reverse order, since the operator accepts also multiple values to concatenate at the stream's beginning. For example, let's consider a stream consisting of values from 1 to 10, we would like to append to each stream a set of values from -9 to 0 using `startsWith`:

```typescript
from([1, 2, 3, 4, 5]).pipe(
      startWith(...Array(10).fill(0).map((value, index) => value - index).sort((first, second) => first - second)),
).subscribe({
      next: (value: number) => console.log(value),
      error: (err) => console.error(err),
      complete: () => console.log('Complete'),
});
```

notice that `...Array(10).fill(0).map((value, index) => value - index).sort((first, second) => first - second)` creates a sorted array of values from 0 to -9 and then using the **spread operator** those values are passed as arguments to `startWith`.

On the opposite side, `finalize` is triggered once when the stream has been closed, that is when the function `close` as been invoked. It accepts a function that typically performs side-effect operations such as logging, however, it can be useful to release resources acquired previously. The following is a easy example that prints out a log message when the stream is just closed:

```typescript
range(1, 100).pipe(
      finalize(() => console.log('the stream has been closed successfully')),
).subscribe({
      next: (value: number) => console.log(value),
      error: (err) => console.error(err),
      complete: () => console.log('Complete'),
});
```

the important thing to notice is that the message `the stream has been closed successfully` is printed after the message `Complete` defined in the `complete` function, because the execution of `complete` is the events that will trigger `finalize`.

There is a final operator that combines both events of subscription and closing that is `using`. The operator takes two **factory function** that return the action to perform when the stream is closed, and the Observable that emits the values flowing through the stream. In a certain way, `using` wraps an Observable in a new Observable, overriding the normal operators `subscribe` and `unsubscribe`. Another important thing is that the first factory function have to returns a **disposable object**, that is an object containing a method named `unsubscribe()` to call when the stream will be closed.

Let's see an example of how using this new operator: suppose that an Observer is emitting values each 500ms, before the values' emission, we would like to print a log message informing that the stream is starting to emit values, then, after 5s, the `unsubscribe` method is invoked, forcing the stream's closure and printing a new console message, informing that the stream has been closed. Let's start creating the `DisposableResource` object, creating a class with the same name:

```typescript
class DisposableResource {
      private isDisposed: boolean;

      public constructor() {
            this.isDisposed = false;
      }

      public unsubscribe() {
            if (!this.isDisposed) {
                  this.isDisposed = true;
                  console.log("The resource has been disposed!");
            }
      }
}
```

`unsubscribe` checks if the stream is still open, if it is open and the stream is going to be closed, the message will be print. The next step consists in creating the new Observable using the `using` operator:

```typescript
const inputResource$ = interval(500).pipe(
      map((value) => Math.random() * value),
      filter((value) => value < 0.5),
);

const disposableObservable$ = using(
      () => new DisposableResource(),
      () => {
            console.log('The stream is going to emit values');
            return inputResource$
      },
);
```

in this specific case, we decided to slip the definition of the Observable from the definition of its disposable version, it is not mandatory, thus we can define the input Observable directly in the second factory function. Now, let's subscribe to `disposableObservable$` and close it after 5s:

```typescript
const disposableSubscription$ = disposableObservable$.subscribe({
      next: (value) => console.log(value),
      error: (err) => console.error(err),
});

setTimeout(() => disposableSubscription$.unsubscribe(), 5000);
```

the final result will be the message `The stream is going to emit values` followed by a set of values less than 0.5 and then after 5s the message `The stream has been closed!`;

## The `forkJoin` and `combineLatest` operators for parallel's stream management

Let's consider the common task of handle different values coming from different asynchronous resources without using any other concepts like Promise or Observable, using just callback functions. In a similar scenario, you will probably produce a code like this:

```typescript
let [aFirstResult, aSecondResult] = [null, null];

httpCall('/source/1', result => aFirstResult = result);
httpCall('/source/2', result => aSecondResult = result);

setTimeout(() => handleResults(aFirstResult, aSecondResult), 10000);
```

it this an acceptable solution? ... of course no, the chances of getting the right result is near to 0. Let's consider the same example using a common rookies's approach in RxJs:

```typescript
const aFirstResult$ = httpCall('/source/1');
const aSecondResult$ = httpCall('/source/2');

aFirstResult$.subscribe({
      next: (aFirstValue) => aSecondResult$.subscribe({
            next: (aSecondValue) => handleResults(aFirstResult, aSecondResult)
      });
});
```

remember that in the first lessons we mentioned that the philology of RxJs is also to avoid nested code like this. Moreover, the inner Observable depends on the emission of the first value from the outer Observable, that is we are forcing the code to be synchronous while we would continue to take advantages from the asynchronous behavior of it.

In the previous chapters we learned about project Observables from another using `switchMap` or `mergeMap`, however, using these operators won't create the desirer behavior for two reasons:

* Nesting two Observables implies that the latter depends on the former, that is dictates the code's execution order.
* All the data must be stored as soon as are emitted up to the Observable's end.

Remember that we would like to run both tasks in parallel get the final result (containing a set of all the resulting values) as soon as each async operation has been completed.

### `combineLatest` 

While `merge`, `concat` and `switch` combine different Observables in a single one containing the last emitted value from the latest Observable, `combineLatest` executes Observables in parallel merging all of them in a unique one, containing all the last emitted values of each Observable. Let's consider the following example:

```typescript
const letters$ = interval(500).pipe(
      map((number) => String.fromCharCode(number)),
);

const numbers$ = interval(1000).pipe(
      map(() => Math.random()),
);

combineLatest([letters$, numbers$]).subscribe({
      next: (value) => console.log(value),
});
```

the Observables `letters$` and `numbers$` emits two different values in two different time. Combining them using the `combineLatest` operator, creates a new Observable that emits a new value each 500ms containing both strings emitted from `letters$` and numbers from `numbers$`. However, the values from the latest Observable changes only after 1s, while each 500ms we observe the same value emitted previously.

The behavior of `combineLatest` is quite intuitive with asynchronous sources, however, you must be careful working with synchronous sources due to their nature. Suppose to have two sources sources named `studentsPassed$` and `studentsNotPassed$`, representing the set of students that passed or not an exam. We would like to get all the students that attempted the exam, with their corresponding final mark. An acceptable solution would be to use `combineLatest` to merge the two sources in a new one, like in the following way:

```typescript
const studentsNotPassed$ = from<Student[]>([
      { firstName: 'Mario', lastName: 'Rossi', mark: 17, },
      { firstName: 'Federico', lastName: 'Rossi', mark: 12, },
      { firstName: 'Maria', lastName: 'Rossi', mark: 11, },
      { firstName: 'Federica', lastName: 'Rossi', mark: 17, },
]);

const studentsPassed$ = from<Student[]>([
      { firstName: 'Angelo', lastName: 'Verdi', mark: 18, },
      { firstName: 'Angela', lastName: 'Neri', mark: 29, },
      { firstName: 'Marta', lastName: 'Bruni', mark: 21, },
      { firstName: 'Marco', lastName: 'Gialli', mark: 30, },
]);

combineLatest([
      studentsPassed$,
      studentsNotPassed$,
]).subscribe({
      next: ([ passed, notPassed]) => {
            console.log(`${passed.firstName} ${passed.lastName} passed with exam with mark ${passed.mark}`);
            console.log(`${notPassed.firstName} ${notPassed.lastName} not passed with exam with mark ${notPassed.mark}`);
      },
});
```

however, the output result is not the expecting one ... because `studentsPassed$` is synchronous that is emitted all its values have been already emitted as soon as we subscribed to it, and starting to printing the values emitted from the second source. Working with synchronous sources, concatenating values must be done with the `concat` operator.

### `forkJoin`

Similarly to `combineLatest`, `forkJoin` executes a set of Observables in parallel emitting only the last value emitted from each of them. in HTTP requests this is a desirable behavior because the emitted value is only one from each source, then a value is emitted containing all the last values only if each Observable is completed. Let's consider the following example:

```typescript

function makeHttpRequest(timeout: number): Observable<IHttpResponse>{
      return timer(Math.ceil(Math.random() * timeout)).pipe(
            map(() => {
                  if (Math.random() > 0.5) {
                        return { data: 'Success!', code: 200 };
                  }
                  return { data: 'Error!', code: 500 };
            }),
      );
}

forkJoin([
      makeHttpRequest(3000),
      makeHttpRequest(1000),
]).subscribe({
      next: ([firstResponse, secondResponse]) => {
            console.log(`[First call] - ${firstResponse.data}  with code ${firstResponse.code} `);
            console.log(`[Second call] - ${secondResponse.data}  with code ${secondResponse.code} `);
      }
});
```

using the factory function `makeHttpRequest` we are going to create two different request with a different delay, combining them using the `forkJoin`, the result will be emitted only after at least 3000ms and will contain the result of each request with their corresponding HTTP status code. 
