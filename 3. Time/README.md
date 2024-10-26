# Time dimension in RxJs

Time is an invisible dimension in programming and working with asynchronous code is always tricky, especially in JavaScript, however, RxJs ables us to treat time as an additional dimension of our data source, and then treat asynchronous code like synchronous one, in other terms we are able to serialize operations so that we can execute tasks only after the competition of another one.

In this chapter we will focus on operators concerting time, starting from new factory functions that creates Observables emitting values with a time rate, and then operators for filtering and storing values based on some time conditions. 

## Factory functions

`setInterval` and `setTimeout` are asynchronous JavaScript's function that trigger the callback function parameter each time in a fixed interval represented by the second parameter in the former and once after the time indicated by the second parameter in the latter. In RxJs there are two similar factory functions that emulates these behaviors, `interval` and `timer`.

Let's start with `interval` and let's examine this piece of code:

```typescript
const intervalObs = interval(1000);
```

up to this point we created a new Observable named `intervalObs` who emits integer values, starting from 1 and every 1000ms, as soon as an Observable subscribes to it.

Another other common operator whose logic is more close to an Observable (respect to `interval`) is `timer`. Just like the `setTimeout` function in JavaScript, `timer` triggers an event after that the about of input time is passed.

Now, the question is, why should we use `interval` and `timer` instead of `setInterval` and `setTimeout` that behaves exactly in the same way? The answer is that while <u>JavaScript needs that the allocated resources should be released, RxJs does it automatically</u>, moreover, `setTimeout` and `setInterval` are callbacks requiring some values outside from then, therefore are not pure functions, while the corresponding methods in RxJs are pure functions.

## Filtering operators

In this section, like in the previous chapter, we are going to examine each operator using its nature, that is, we will start from filtering operators to utility operators. Of course, each of these operators concerns using time as new dimension to manage events' emission.

### `debounce` and `debounceTime`

Sometimes we would like to filter some events only after that a particular time span has been passed, for example, using a text input, and considering that each event is represented by a key pressed, we would like to emit a new value only after that 2s have been passed since the last keyword has been pressed. Of course, in this case the time span event is represented by a keyboard event whose interval between pressing a key and another is not fixed, on the other hand we can also consider specific time interval having a fixed size.

Considering the latest scenario, the `debounce` operator consists in filtering values whose the time span between the its emission and the emission of the previous value is smaller than the time span the emission of another event from another observable . In software terms, **debouncing** means _executes something only after a certain period is passed without anything has been done_. I know that this operator is quite cumbersome to understand, however, let's consider the following figure:

<p align="center">
    <img src="../assets/3. Time/debounce.png" alt="Debounce Operator" style="width:100%">
</p>

the source is emitting a set of random number with different time span, considering bigger squares to be 1s (eg. the second value `2` is emitted 2s after that the first `2` has been emitted). The `debounce` operator that we are going to apply emit a new event each 2s, once the first `2` has been emitted 3 seconds passed before the emission of the second `2`, thus we can emit the first `2`. `2`, `9` and `1` were emitted with a time span of 1s, thus `9` and `1` can be discarded because the time span is less the 2s, however, we can emit `1` because the time span between `1` and `3` is greater than 2s, moreover, also `3` can be emitted, because the time span between `3` and `7` is exactly 2s. Finally, the Stream has been closed, thus, the latest value `7` can be emitted.

Let'see some examples implemented in [**debounce.ts**](./debounce.ts): in f

```typescript
from(['Mario', 'Maria', 'Federico', 'Federica']).pipe(
      debounce(() => timer(1000)),
).subscribe({
      next: (name) => console.log(`Hi! I'm ${name}`), // Hi! I'm Federica
});
```

if you kept in mind the Marble Diagram you probably guess why the only emitted value is `Federica`, because all of these values are emitted almost instantly, thus the time span between each emitted value is approximately 0s, however, since `Federica` is the latest one, it will be emitted.

```typescript
interval(1000).pipe(
      debounce((value) => timer(value * 200)),
      map((value) => ({ timestamp: moment().toISOString(), value })),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${timestamp}] : ${value}`), // 0, 1, 2, 3, 4, 5
});
```

in this example, only `1`, `2`, `3`, `4`, `5` will be emitted, because `interval` emits increment values starting from 0 with a time span of 1s, while `timer` will emit an event each 200ms times the current emitted value from `interval`. Therefore, since the time span between each event emitted from `timer` is less than the time span of each event emitted from `interval`, the event will not be discarded.

Since we used `debounce` only with time events, `debounceTime` is a useful and contract alternative to `debounce` requiring as parameter only the minimum time span that must occur between each event, of course in ms. Therefore, we can rewrite some of the previous examples in the following way:

```typescript
from(['Mario', 'Maria', 'Federico', 'Federica']).pipe(
      debounceTime(1000),
).subscribe({
      next: (name) => console.log(`Hi! I'm ${name}`),
});

interval(1000).pipe(
      debounceTime(2000),
      map((value) => ({ timestamp: moment().toISOString(), value })),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${timestamp}] : ${value}`),
});
```

however, the latest Observable will not emit any value, because we have to pass a fixed size of time span. In you think that passing an external variable as increment argument, like `200 * (i++)` remember that Observables are lazy data structures, that is, `debounceTime` with its values is evaluated only once, in the beginning having as initial value `i=0`.

Up to this time, in which context this operator can be used and is effectively useful? If you are implementing a searching box where each time the user writes something making sense makes an HTTP call, you can't make a call for each character of the search string, since it is probably that the user will type something wrong and than deletes the input string to write it again. `debounce` is our solution, because we can use this operator to get strings that are emitted only from 1s from the others, meaning that the user stops typing.

### `throttle` and `throttleTime`

Just like `debouce` also `throttle` is a filtering function based on time. However, differently from `debounce`, `throttle` delays the emission of a value emitted by a source as soon as an external events happen, meanwhile, if a new value has been emitted from the former source it will be ignored. Let's observe the Marble Diagram corresponding to apply the `throttle` operator:

<p align="center">
    <img src="../assets/3. Time/throttle.png" alt="Throttle Operator" style="width:100%">
</p>

as you can see, the first source is emitting a set of random numbers, on the other hand, we are going to apply the `throttle` operator using an external source emitting events represented by the `x` value. After that a number has been emitted from the first source, `x` is emitted from the latter source, as long as the Observable that emitted `x` is active, each emitted value from the former source will be ignored.

The following example can be found in [**throttle.ts**](throttle.ts)

```typescript
const firstSource$ = interval(1000).pipe(
      map((value) => Math.ceil(Math.random() * value)),
      map((value) => `[${moment().format()}] ${value}`)
);

const secondSource$ = timer(2000).pipe(
      map((value) => Math.ceil(Math.random() * value)),
      map((value) => `[${moment().format()}] ${value}`)
);

firstSource$.pipe(
      throttle(() => secondSource$)
).subscribe({
      next: (value) => console.log(value),
});
```

two different sources `firstSource$` and `secondSource$` are emitting different values each, however, the first source is emitting a value each 1s while the latter emits a value and closes itself after 2s. After that a value is emitted from `firstSource$`, each next values are ignored for 2s, in fact, we expect that each value time span of 3s from each other.

## Utility functions

### Delay the emission of a value

Up to this point we saw operators that emits values after a certain amount of time, or in a certain time span. However, none of these operators changes the an event's emission time span. On the other hand, `delay` operator shifts the emission time of values using the input time span parameter.

Now, by applying the `delay` operator to an Observable generated using `interval`, do each value's emitted shifted? The answer is no, `delay` shifts only the emission of the first value, thus the others remain will be emitted normally. It's important to notice events are still generated once an Observer will be attached to the Observable, that is, only the <u>propagation of the values through the stream</u> is affected.

The last statement leads us to understand one of the core feature of Reactive Programming, that is, operators do not know the Observable that will produce the events flowing through them, for this reason events' generation process cannot be shifted, but only the emission process is affected.

Let's have a look to this example:

```typescript
from([1, 2, 3, 4, 5])
      .pipe(
            delay(1000),
            map((value) => value + 1),
            delay(1000),
            map((value) => value + 1),
      )
      .subscribe({
            next: (value) => console.log(value),
            complete: () => console.log('complete'),
      });
```

if you expecting that each value is printed with a distance of 2s from the next one you are wrong, because, `delay` does not affect the emission's time span of a value, however, delays only the current value's time span that reaches the operator, thus, once a value flows through the pipe, and reach `delay` the next value is emitted normally, and since each value is emitted synchronously and almost instantly, as soon as `1` reaches `delay`, `2` is emitted and reaches `delay` almost in the same instant.

### `timestamp`

Back to a previous example

```typescript
interval(1000).pipe(
      debounce((value) => timer(value * 200)),
      map((value) => ({ timestamp: moment().toISOString(), value })),
).subscribe({
      next: ({ timestamp, value }) => console.log(`[${timestamp}] : ${value}`),
});
```

would be better having a function that attaches a timestamp to each emitted value? Luckily, `timestamp` attaches a timestamp automatically to each emitted value, returning a new type `Timestamp<T>`, containing two elements: `timestamp` that is the current difference in milliseconds between now and the 1th January of 1970, just like [`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now); then, `value` contains the previous value.

### `timeout`

Up to these point, none of the previous operator is able to thrown an exception. However, sometime you will probably need to throw an error if nothing happens after a certain time span, otherwise, you will waste resources for waiting something that will probably not happen. `timeout` throws an exception if no value is emitted from the Observable after a certain amount of time:

```typescript
from([1, 2, 3, 4]).pipe(
      delay(5000),
      timeout(1000),
).subscribe({
      next: (value) => console.log(`Received value: ${value}`),
      error: () => console.error('Timeout!'),
      complete: () => console.log('Completed'),
});
```

no value will be emitted, because, `delay` delays each value of 5s, however, `timeout` throws an error as soon as 1s is passed. This is an interesting example, because, you can observe that operators can also be executed in parallel, because `timeout` starts the countdown for throwing an error independently from the others.

## Buffering

Streams are stateless, meaning that they do not store data emitted from the source, sometimes, however, caching values and emitting them as soon as an external event occurs, can be achieved using **Buffering** operators. In RxJs buffering consists in storing a set of values in an internal memory delaying the emission of them.

Values stored in the buffer are broadcasted to the Observers in arrays, instead of single values as emitted from the source. Moreover, buffering values is useful when dealing with huge quantities of events, such as mouse events, when we need to grouping them and apply some operators instead of working on single values.

There are four common buffer operators in RxJs, each one is based on a specific event like `bufferWhen` and others on common conditions like `bufferCount`, `bufferTime` and `buffer`.

Starting from `buffer`, it gathers data emitted by a data source until an observable passed as parameter known as **closing Observable** emits an event. As soon as the event is emitted by the closing Observable, the buffer is flushed and an array containing all the buffered events is emitted to attached observers. As we can see from the following figure:

<p align="center">
    <img src="../assets/3. Time/buffer.png" alt="Buffer Operator" style="width:100%">
</p>

the first source is emitting a sequence of values, however, `buffer` stores these in a buffer until another Observable will emit an event represented by `x`. As soon as `x` is emitted, all the values stores in the buffer are immediately returned inside an array.

Let's see how `buffer` works practically using some examples implemented in [**buffer.ts**](./buffer.ts):

```typescript
interval(1000)
      .pipe(buffer(interval(2000)))
      .subscribe({
            next: (value) => console.log(`[${value}]`),
      });
```

we are creating a source emitting values each 1s, then a buffer is registered catching values and emitting them flushing itself each 2s, using the Observable factory function `interval(2000)` which emits a value each 2s. Finally, the values are printed to the console in the Observer. The expected result should print each 2s an array containing two elements considering that each element is emitted at 1s ratio. Moreover, what happens if the closing Observable emits a new value each 500ms? The output will be updated printing each 500ms an empty array, and an array of just one value.

While `buffer` emits values based on a generic condition expressed by the closing Observable, `bufferCount` caches values in the buffer flushing itself only once the input size is reached, as we can see from the following example

```typescript
interval(500)
      .pipe(
            bufferCount(5),
            map((values) => values.map((value) => value % users.length)),
            map((indexes) => indexes.map((index) => users[index]?.username)),
      )
      .subscribe({
            next: (names) => console.log(names),
      });
```

what we are going to do is emit values in a rage of 500ms and caching them in a buffer as soon as it reaches the size limit of five elements. As soon as five elements are in the buffer, we are going to transform the numbers in the buffer in indexes of an array and then on user's usernames. In the end, the final result is printed in the console.

`bufferWhen` cache values as soon as an Observable emits a value similarly to `buffer` operator. However, the difference between the former and the latter is that `bufferWhen` accepts a factory function that creates the Observable, then the values are cached and finally the buffer is flushed. 

Finally, the last operator is `bufferTime` that stores data in the buffer as soon as the time range passed as input is reached. If we would like to store values emitted from the source for an amount of time of 5s, we will implement something like this:

```typescript
interval(1000).pipe(
      bufferTime(5000)
).subscribe({
      next: (value) => console.log(`[Buffer Time] - [${value}]`),
});
```
