# Managing Multiple Streams

Up to this point, we dealt with streams having an unique data source emitting values that flows in the stream. However, common programming tasks involve combine streams and their results updating the state of our application, i.e. a user pressing the login button can trigger a validation process and in the same time make an HTTP request to the server. In this chapter we will focus on the commonest operators that manages multiple streams like `combineLatest`, `merge`, `switch` and `concat` and we will focus on a Functional Programming principle known as **flattening a data type** that is flatten multiple sources in a unique one.

There are three main strategies to merge streams together:

1. **Interleave events by merging streams** used to merge two different streams in a single one, and is ideal for handling events emitted from different sources that must be threated in the same way.
2. **Preserve order of events by concatenating streams** used to merge two streams preserving the emission order.
3. **Switch to the latest stream data** used when one events starts another immediately.

## Interleave events by merging streams using `merge`

`merge` is the simplest merging operators, its aim is to combine events from different streams, ordering them by the arrival order, in a single observable, as shown in the figure below:

<p align="center">
    <img src="../assets/5. Multiple Stream Managing/Merge.png" alt="Merge Operator" style="width:100%">
</p>

where events coming from two different sources are merged maintaining the emission's order. As we can see, the figure contains only two Observables, however, the signature of the `merge` operator accepts an array or an infinite number of Observables as parameters. In the following example, we can see how the operator can be used:

```typescript
const firstObservable$ = interval(500).pipe(map((value) => `[Observer 1] - ${value}`));

const secondObservable$ = interval(600);

merge(firstObservable$, secondObservable$).subscribe({
      next: (value) => {
            if (typeof value === 'string') {
                  console.log(`The string ${value} has been emitted!`);
            } else {
                  console.log(`The number ${value} has been emitted!`);
            }
      },
});
```

I think that the example is quite clear, however, there is something that does not work here, not logically but conceptually. Reactive Programming is based on Functional Programming, and control structure like `if-else`, `for` and `while` should be avoided in the code because can create side effects in our program. However, the two Observables are emitting different types of events, that is we have to merging them in one specific type, for example, we would like to emit only values like `{value: string}`, therefore, we have to use the `map` operator to transform the values emitted from the Observables:

```typescript
const firstObservable$ = interval(500).pipe(
      map((value) => `[Observer 1] - ${value}`),
      map((value) => {
            return { value };
      }),
);

const secondObservable$ = interval(600).pipe(
      map((value) => {
            return { value: `${value}` };
      }),
);

merge(firstObservable$, secondObservable$).subscribe({
      next: (value) => console.log(`${value.value} has been emitted!`),
});
```

Up to this point, we saw examples with asynchronous code, emitting values in different instants. However, what happens if we are emitting values from synchronous sources, and those values are emitted in the same instant? Since the values are already loaded in memory, `merge` will iterate over the elements of the first observable, then over the elements of the second and so on and so forth, without alternating values.

## Preserve events' order using `concat`

Concatenating Observable using `merge` will result in a shuffle of values, because `merge` maintains the temporal order in which events are emitted, and does not cares about the order in which observables have been attached. On the other hand, if you are interested in preserving the order in which the observables have been concatenated, `concat` is the right function. Let's consider the following figure:

<p align="center">
    <img src="../assets/5. Multiple Stream Managing/Concat.png" alt="Concat Operator" style="width:100%">
</p>

There are two sources emitting red and orange shapes, in this example `merge` emits both red and orange shapes alternating them. However, `concat` preserves the order of the Observable, that is red shapes will be emitted prior, while oranges one former.

Let's consider a common scenario, we would like to concat two Observables, the second is faster then the first, because values are already in memory, however, we would like that values from the first Observable will be emitted prior than values from the second. This scenario can be represented in the following code:

```typescript
const interval$ = interval(200).pipe(take(Math.floor(Math.random() * 10)));
const numbers$ = range(0, 10).pipe(map((value) => Math.random() * value));

concat(interval$, numbers$)
      .pipe(map((number) => number.toPrecision(2)))
      .subscribe({
            next: (value) => console.log(value),
      });
```

we created two Observables `interval$` and `numbers$`, where values from `numbers$` are ready respect to the `interval$` that must wait some seconds before emitting their values. However, using `concat` values from `interval$` will be processed prior than values from `numbers$`. The same example in another scenario could be a sequence of HTTP calls, where we would like to wait the result from the previous, before make the second and process their values.

However, we must be careful to use this operator with Observables that can emit infinite values potentially, in fact, the previous code without the `take` operator for `interval$` and using `concat` will cause an infinite wait and no emission of values from the observable `numbers$`. A common example is a listener of user interaction like mouse event, that are potentially infinite, for this reason is a good practice to create a limit for the emission of values, like in the previous example using `take`.

## Switching Observables with `switchAll`

Both `merge` and `concat` creates a new Observable containing both values from the input ones, however `switchAll` returns a new Observable containing values from the last observable emitting values. Let's consider the following scenario: each 1s a value is emitted from a source, instead of mapping this value in a random one, we would like to return another observable that emits a random value multiplied by the previous emitted value, just like the following code:

```typescript
interval(1000)
      .pipe(
            map((value) => of(value).pipe(map((value) => Math.random() * value))),
            switchAll(),
      )
      .subscribe({
            next: (value: number) => console.log(value),
      });
```

Once the new Observable has been created, the previous one is no longer needed, thus `switchAll` authomatically close the first Observable releasing its resources.

## Flattering operator

Nested Observables are frequently scenarios, especially when you want to trigger an event starting from the occurrence of another one. Now, even if this scenario is a common one, dealing with nested Observables is not easy, and we saw how can we combine `map` and `switchAll` to flat the nested Data Structure, closing the prior Observable. `mergeMap` is the evolution of these operators' combination, that does not close the first Observable, moreover returns a new Observable made by the combination of the previous two, and flatten its contents.

Let's consider the following example: a source is emitting values from 1 to a random number, then once a value is emitted we would like to return a new Observable that returns a string like `:value has been emitted`. Finally, we would like to print the string values contained in the second Observable:

```typescript
const numbers$ = range(1, Math.floor(Math.random() * 10));

numbers$.pipe(map((number) => of(`${number} emitted`))).subscribe({
      next: (observable) => {
            observable.subscribe({
                  next: (value) => console.log(value),
            });
      },
});
```

nested subscription it is not a good idea ... `mergeMap` is such an useful operator because allows to simplify the managing of nested Observables by flattering them:

```typescript
const numbers$ = range(1, Math.floor(Math.random() * 10));

numbers$.pipe(mergeMap((number) => of(`${number} emitted`))).subscribe({
      next: (value) => console.log(value),
});
```

There are two more flattering operators, that like `mergeMap` can be considered as a combination of the previous operators that we saw:

- `concatMap` applies a mapping function to values emitted from an Observable and returns the concatenation of all the values in an unique Observable. However, differently from `mergeMap`, it waits the previous Observable completes before creating a new one, thus preserving the order of the emitted events.
- Similarly to `mergeMap`, `switchMap` emits only the latest value emitted from the starting Observable, wraps the value in a new Observable and closes any previous Observables.
