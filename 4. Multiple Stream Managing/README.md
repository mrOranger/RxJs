# Managing Multiple Streams

Up to this point, we dealt with streams having an unique data source emitting values flowing in the stream. However, common programming tasks involve combine streams and their results that update the state of our application, i.e. a user pressing the login button can trigger a validation process and in the same time make an HTTP request to the server.

Moreover, in real world application, events can come from different sources, thus, since each Observable represents a single source, we need a way to combine different Observables without making huge changes in our application. Remind the introduction of the repository, where we introduced the [**Reactive Manifesto**](../README.md), we said that one principle of this Manifesto is **elasticity**, that is: *"the capability of a system to stay responsive under different workloads"*. Different workload can be interpreted as different data sources, that is different Observables, and fortunately, RxJs provides us different mechanism to merge Observables without have to refactor the entire code.

There are three main strategies to merge streams together:

1. **Interleave events by merging streams**, merges different streams considering them as an unique one. Let's consider that we have to create an application working both with mouse and touch events, each of these events represents an Observable, of course, it would be quite hard to design and implement this application twice for each event. Fortunately, using this merging strategy, we can create a single application without taking care of which type of Observable is emitting events.

2. If have to care about the emission's order, **Preserve order of events by concatenating streams**, would be the better strategy. If we are running different Observables, and each one of these requires additional operations, we have to care about which one had been completed first.

3. Finally, **Switch to the latest stream data** consists in dealing only the latest emitted event, for example in events' chains where one event can trigger another.

In this chapter we will focus on the commonest operators that manages multiple streams like `combineLatest`, `merge`, `switch` and `concat` and we will focus on a Functional Programming principle known as **flattening a data type**, consisting in merging different sources threating them like a single stream.

## Interleave events by merging streams using `merge`

`merge` is the simplest merging operators, its aim is to combine events emitted from different Observables, in their arrival's order. Let's see its corresponding Marble Diagrams:

<p align="center">
    <img src="../assets/4. Multiple Stream Managing/merge.png" alt="Merge Operator" style="width:100%">
</p>

two different sources named `A$` and `B$` are emitting different values, and `merge` creates a new Observable whose emitted values are the result of the combination of each events emitted from the Observables. Moreover, notice that the emission's order of each value is preserved in the final Observable.

Let's examine a first example of using `merge`, each of these example are in [**merge.ts**](./merge.ts):

```typescript
const first$ = interval(1000).pipe(
      map((value) => `first$-${value}`),
);

const second$ = interval(500).pipe(
      map((value) => `second$-${value}`),
);

merge(first$, second$).subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('complete'),
});
```

two independently and asynchronous sources `first$` and `second$` are emitting values with a different time span. Using `merge` we are creating a new Observable that emits values of the same time, with the time span of `second$`. Moreover, since the time span of the first Observable is longer than the time span of the second Observable, as soon as `second$` emits a new value, the previous value emitted by `first$` is emitted twice.

Then, we saw how to use `merge` as a factory function, that is, creates a new Observable using other Observables passed as a parameter. However, there is an alternative way to use `merge` as an operator rather than a factory function. In previous versions of RxJs, there was not distinction between these operator, since both of them were indicated by the same name `merge`. However, in new versions of RxJs, `merge` is the factory function, while `mergeWith` is the operator merging the first input source with a second one. Thus, we can rewrite the same previous example as follows:

```typescript
first$.pipe(
      mergeWith(second$),
).subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('complete'),
});
```

What is happening if one of the merged Observables throws an error? Since `merge` creates a new Observable merging events from each of the input Observables, if one of the input Observables throws an error, the other Observables will emit their events still. Then, the resulting Observables throws an exception if and only if all the input Observable thrown an exception:



Up to this point, we saw examples with asynchronous code, emitting values in different instants. However, what happens if we are emitting values from synchronous sources, and those values are emitted in the same instant? Since the values are already loaded in memory, `merge` will iterate over the elements of the first observable, then over the elements of the second and so on and so forth, without alternating them.

## Preserve events' order using `concat`

Concatenating Observable using `merge` will result in a shuffle of values, because `merge` maintains the temporal order in which events are emitted, and does not cares about the order in which observables have been attached. On the other hand, if you are interested in preserving the order in which the observables have been concatenated, `concat` is the right function, just like `concat` with strings. The corresponding Marble Diagram of `concat` operator is the following:

<p align="center">
    <img src="../assets/4. Multiple Stream Managing/concat.png" alt="Concat Operator" style="width:100%">
</p>

We would like to concatenate `A$` and `B$` in a single source maintaining the values' emission's order, however, the second source is emitting values before the former. `concat` will no emit values until the former won't, in fact, as you can see, the resulting Observable is not emitting values from the beginning, but only after a certain delay. Thus, as soon as the former source will be closed, the values of the latter are emitted in the same arrival's order.

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

Just like `mergeWith`, `concat` has a corresponding operator that can be used instead of a factory function, just like in the following example:

```typescript
const firstNames$ = from(users).pipe(
      map((user) => `First Name: ${user.name}`),
      take(10),
);

const usernames$ = from(users).pipe(
      map((user) => `Username: ${user.username}`),
      take(10),
);

firstNames$.pipe(
      concatWith(usernames$),
).subscribe({
      next: (value) => console.log(value),
});
```

like in the previous example with `mergeWith`, the result is the same if we are using `concat` as factory function.

However, be careful to use this operator with Observables that can emit infinite values potentially, in fact, the previous code without the `take` operator for `interval$` and using `concat` will cause an infinite wait and no emission of values from the observable `numbers$`. A common example is a listener of user interaction like mouse event, that are potentially infinite, for this reason is a good practice to create a limit for the emission of values, like in the previous example using `take`.

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

Once the new Observable has been created, the previous one is no longer needed, thus `switchAll` automatically close the first Observable releasing its resources.

## Flattering operators

Let's consider the following scenario: we are implementing a RxJs program such that, each time a user clicks on a button, an HTTP call is made to a backend's endpoint. Up to thins point, using only the operators that we saw previously, how can we implement this functionality? Let's start by simulating the click and http call events using two custom Observables like these:

```typescript
type HTTPResponse = {
      status: number;
      message: string;
};

type ClickEvent = {
      timestamp: number;
      target: string;
};

const click$ = new Observable<ClickEvent>((subscription) => {
      const timeoutRef = setTimeout(() => {
            subscription.next({ timestamp: Date.now(), target: '#signUpButton' });
            subscription.complete();
            clearTimeout(timeoutRef);
      }, 1000);
});

const http$ = new Observable<HTTPResponse>((subscription) => {
      const timeoutRef = setTimeout(() => {
            if (Math.random() < 0.5) {
                  subscription.next({ status: 200, message: 'Signup Successfully!' });
                  subscription.complete();
            } else {
                  subscription.error({ status: 422, message: 'Invalid credentials!' });
            }
            clearTimeout(timeoutRef);
      }, Math.floor(Math.random() * 1000));
});
```

now, an acceptable solution would be subscribing to `http$` once an event from `click$` will be emitted, however, Observables are lazy data structures, thus, receiving events from `click$` requires be subscribed to it:

```typescript
click$.subscribe({
      next: (event) => {
            console.log(`Clicked on ${event.target}`);
            http$.subscribe({
                  next: (response) => console.log(response.message),
                  error: () => console.error('An error occurred!'),
                  complete: () => console.log('HTTP request completed!'),
            });
      }
});
```

However, reminding the [**first chapter**](../README.md), one of the main reason that leads us to use RxJs is avoiding to use the so called **callback heel**, that is, nesting multiple asynchronous branches that must be manage separately. An alternative approach would be to use `map` to return another Observable, however, the Observer will receive a nested Observable, thus, the problem stands.

What do we need now are **flattering operators**, that are, operators receiving an Observable as parameter and then return another Observable, closing the first Observable's subscriptions correctly. They are so called flattering operators, because, return flat Observables starting from nested ones. Just like the previous section, there are three flattering operators having a similar behavior like `merge`, `concat` and `switch`, known as `mergeMap`, `concatMap` and `switchMap`, we are going to examine their behaviors and different real cases in which they can be used, moreover, there is an additional operator known as `exhaustMap`. Since the difference between these operators is quite cumbersome to understand, for each operator we will repeat the same example, to analyze the real difference between them.

In the next sections we will follow an alternative approach in showing example, since the differences between each of these operators can be easily misunderstood. Therefore, we will take a look at the same example applying each of these operators, and observing how the final result is changing with each operator.

### Flattering Observables running in parallel

Imagine the following scenario, an Observable is emitting a sequence of events representing a click, once an event has been emitted, a delay is applying to it. Let's see how can we use `mergeMap` to implement this scenario, and what is the corresponding result:

```typescript
const click$ = new Observable<ClickEvent>((subscription) => {
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.next({ x: Math.random(), y: Math.random() });
      subscription.complete();
});

click$.pipe(
      mergeMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log("Completed!"),
});
```

having a quickly look, we expect that each event will be emitted with a distance of 1s from the next one. However, it won't be happen because having a look at the console results, each event is emitted and received instantly after 1s without any time span between each event. The reason behind this strange behavior stands in `mergeMap`, in fact, <u>it won't block the source to emit events meanwhile the operator is working</u>. In other words, once a new click has been emitted and reaches the `mergeMap`, to be delayed, `click$` will no stop to emit new events, therefore, each click reaches `mergeMap` more or less in the same instant, and each one will be observed by the Observer after 1s.

Let's take a look at the corresponding Marble Diagram of this example:

<p align="center">
    <img src="../assets/4. Multiple Stream Managing/mergeMap.png" alt="Merge Map Operator" style="width:100%">
</p>

as we can see `mergeMap` is a sort of projection operation that is no stopping the source to emit new events. As soon as the source `A$` emits a new events it is projected in the `B$` pipeline, that is, each time `x` is emitted, the corresponding projected event from `A$` is emitted. However, while `B$` is running, also `A$` does, thus, once the second `1` is emitted, the next instant `B$` is ready to emit its value `2`, and when the second `2` is emitted, `A$` as already emit the first `3`, therefore, in the next instant `3` will be emitted in the final
Observable.

### Flattering maintaining the order

What happens if we change the operator from `mergeMap` to `concatMap`? Remember the difference between `merge` and `concat`, that is, `concat` respect to `merge` keeps the emission's order of the events. In the say way, `concatMap` maintain the emission's order, stopping the source to emit new values as soon as `mergeMap` is working. That is, the new example in [**concatMap.ts**](./concatMap.ts):

```typescript
click$.pipe(
      concatMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log("Completed!"),
});
```

now each value will be emitted with a time span of 1s between each value. In fact, stopping the the Observable to emit new values, results in maintaining the same emission order, however, keep in mind that with asynchronous code, `concat` and `concatMap` could be harmful to use, because we do not have the guarantee that a specific event will be emitted from the Observable.

Finally, let's take a look at the corresponding Marble Diagram of `concatMap`:

<p align="center">
    <img src="../assets/4. Multiple Stream Managing/concatMap.png" alt="Concat Map Operator" style="width:100%">
</p>

as you can see, there is no more overlaps between the emission of each event, moreover, the order is kept. In fact, as soon as the second `1` is emitted, the `2` should be emitted from the source `A$`, however, since the source has been stopped, the first `2` will be emitted as soon as `B$` stops to running, in the same way of the element `3`.

### Flattering switching to most recent event

Like in previous section, the corresponding flattering operator for `switch` is `switchMap`.
However, differently from the previous flattering operator `mergeMap` and `concatMap`, `switchMap` has a completely different behavior such that <u>as soon as a new event reaches the operator, while it is working, if a new event will be emitted, the previous operator that was processing will be discarded</u>. Let's see how this operator works in our example:

```typescript
click$.pipe(
      switchMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) =>
            console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log('Completed!'),
});
```

running this code, you can see that only one `MouseEvent` will be emitted that is the latest one. In fact, since all the events are emitted in the same instant, while `switchMap` is working a new event is emitted, than the only emitted event that will not stopped is the latest one, because no event will be emitted more.

However, what would be the result if the Observable is emitting events with a certain time span? That is, let's suppose that the example has been updated in this way:

```typescript
const delayClick$ = new Observable<ClickEvent>((subscription) => {
      const timeOutRef1 = setTimeout(() => {
            subscription.next({ x: Math.random(), y: Math.random() });
            clearTimeout(timeOutRef1);
      }, 1000);

      const timeOutRef2 = setTimeout(() => {
            subscription.next({ x: Math.random(), y: Math.random() });
            clearTimeout(timeOutRef2);
      }, 4000);

      const timeOutRef3 = setTimeout(() => {
            subscription.next({ x: Math.random(), y: Math.random() });
            subscription.complete();
            clearTimeout(timeOutRef3);
      }, 8000);
});

delayClick$
      .pipe(
            switchMap((x) => of(x).pipe(delay(1000))),
            timestamp(),
      )
      .subscribe({
            next: ({ timestamp, value }) =>
                  console.log(`(delay) - [${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
            complete: () => console.log('Completed!'),
      });
```

would the result be different from the former without any delay? The answer is yes, because, once the first `MouseEvent` reaches the `switchMap` operator, no events are emitted from the source, that is, no one will be discarded. In the same way, as soon as the second event is reaching the operator, no event will be emitted, because the time span between the second event and the third is longer that the time needed from `switchMap` to complete its work.

Finally, let's take a look at the Marble Diagram of `switchMap`, up to this point, if everything is clear, you will no have any difficulties in understanding how the diagram works:

<p align="center">
    <img src="../assets/4. Multiple Stream Managing/switchMap.png" alt="Switch Map Operator" style="width:100%">
</p>

### Flattering ignoring events

Finally, the last operator that we are going to examine is `exhaustMap`. Unlikely `switchMap` that switches to the most recent emitted value, `exhaustMap` ignores each emitted events while it is working. Therefore, considering the same example:

```typescript
click$.pipe(
      exhaustMap((x) => of(x).pipe(delay(1000))),
      timestamp(),
).subscribe({
      next: ({ timestamp, value }) =>
            console.log(`[${new Date(timestamp).toISOString()}] - Click on (${value.x}, ${value.y})`),
      complete: () => console.log('Completed!'),
});
```

this time only the first event will be propagated to the Observer, moreover, the same Marble Diagram shown for `switchMap` is the following:

<p align="center">
    <img src="../assets/4. Multiple Stream Managing/exhaustMap.png" alt="Exhaust Map Operator" style="width:100%">
</p>
