# Advanced features in RxJs
In the earlier chapters, we defined an Observable as an **Lazy Collection**, emitting values only when a Observer is attached. However, considering an Observable listening events that occur in any time, like mouse movements or a WebSocket, if no Observer is attached to it, no values will be emitted, therefore, what happens to the values emitted previously that the Observable was attached? Do they are just ignored and lost forever, or they are stored somewhere in the Observable? This scenario is the introduction to one of the most important theoretical concepts between RxJs, and that splits the Observables in two different categories **Hot** and **Cold Observables**.

## Hot & Cold Observables

<u>A **Cold Observable** is a data source who emits data only once an Observer is attached.</u> In this sense, all the Observables that we saw are only Cold Observables. Moreover, this type of Observables are lazy, in sense that resources are not required once the Observer has been declared, however, they occupy only a smart portion of memory as long as someone requires it. 

Digging in the theory, once a Observer subscribes to the Observable, a new data source is created, that is, an independent set of values are emitted through the Stream to the new Observer. Suppose that we defined the following Observables:

```typescript
const integers$ = range(1, 100).pipe(
      map((value) => `A new value has been emitted: ${value}`),
);

const firstSubscription$ = integers$.subscribe({ next: (data) => console.log(data), });
const secondSubscription$ = integers$.subscribe({ next: (data) => console.log(data), });

firstSubscription$.unsubscribe();
secondSubscription$.unsubscribe();
```

from the same Observable `integers$` we attached two Observers that we will observe the same stream of data, although the have been created in two different time instants. In a certain sense, the Observable `integers$` is more than a Cold Observable, it is a **Pure Observable** in Functional Programming way, that is, it does not matter when someone subscribes to it, the Observable will emit the same set of values, independently from their Observer. Contrary, the same example with a new `map` operator, becomes an Impure Observable:

```typescript
const integers$ = range(1, 100).pipe(
      map((value) => Math.random() * value),
      map((value) => `A new value has been emitted: ${value}`),
);
```

because, it is not guaranteed that two Observers will receive the same values, due to the presence of `Math.random()`. 

In a certain sense, a Cold Observable is a very similar to a function, even after its definition no data are returned, moreover, only once someone invokes the function it starts to work. Moreover, we can observe that since now, Cold Observables are created using factory functions like `interval` or `range`, that is, functions that returns a cold sequence of values no matter of who is the Observer.

Differently from Cold Observables, **Hot Observables** emits events despite that an Observer is subscribed. A common example in a real world scenario are the JavaScript's Event Emitter, in fact, even if none is listening for events, JavaScript will dispatch mouse events, in a certain sense, Hot Observables also are lazy, in sense that their emitted values are discarded if none is attached to them. Another interesting example of Hot Observables are Promises, in fact, wrapping an HTTP call inside a Promise will cause the execution of it only one someone triggers the Promise, however, once the promise has been fulfilled, it is not possible to execute again it, thus, once the event is emitted (that is the result of the HTTP call), no matter who is listening or not but the values will be dispatched.

Up to this point, we have to give a formal definition of what an Hot Observable is. Let's start again from the events emitted by a mouse click: first of all they are unpredictable, that is, we can't know when a new value will be emitted, moreover, we can't be sure that a value will or not be emitted; then, considering two different Observers subscribing to the same source, however, these Observers will subscribe to the source in different temporal instants, therefore, do these Observer will observe the same set of events? The answer is not, and probably, the first Observer will observe a set of values greater than the second. 

Up to this point, we are able to give the definition of an Hot Observable, that is: <u>an Observable emitting data no matter who is subscribed or not.</u>. Now, do Hot Observables a sort of Impure Observables? Well, depending from an external source can be considered a form of impure behavior, however, from the perspective of the application, Hot Observables are still Pure Observables, because it is a good practice to apply only pure functions to it.

Continuing in talking about Hot Observables, time dimension is crucial in how they interact with other Observers. Let's consider for example a chat application, supposing that you are joining a chat group after that an important message has been sent, of course, none will probability rewrite all the previous messages that you lost, moreover, you will probably not understand all the conversation because some messages were sent after that you joined the chat. Therefore, managing situations like this, where an Observable is attached to an Hot Observables after that some events have been emitted, is crucial in working with Hot Observables. We choose the chat application, because the internet protocol on which they are based, that is **WebSocket**, is just a kind of Hot Observable.

## Reply and Resubscribe mechanisms

Back to Cold Observables, sometimes it is not guaranteed that the same value will be emitted after a new subscription, if the Observable is an Impure one. To understand the previous statement fully, we have to examine two operations that can be done by the Observable and the Observer, that are **reply** and **resubscribe**. Let's give a first definition of them, and later we will explain them better with some example:

* The **reply** action from the Observable means re-emit the same sequence of events to all the Observer subscribed to it. That is, is a common action that we saw in all the previous examples with Cold Observables, however, before emit once more all the events to each Observer, you have to be careful if this operation requires a lot of resources. Let's consider the following example:

```typescript
let counter = 0;

const promise$ = from(new Promise((resolve, reject) => {

      setTimeout(() => {
            if (counter === 0) {
                  counter++;
                  return resolve('Success.');
            }
            return reject('Error.');
      }, 2000);

}));

promise$.subscribe({ next: (message) => console.log(message), }); // Success.
promise$.subscribe({ next: (message) => console.log(message), }); // Success.
```
after the first execution of the Promise, we suppose that the value is incremented and then, another subscription will trigger the `reject` function. This could be happen if the Promise is re-executed once more, however, Promise are stored in the a micro-task queue of JavaScript, and each execution will trigger always the same Promise with the same body. This is a perfect example of reply action, because, the subscription will not cause the Promise re-execution from scratch, however, causes only the re-emission of the last value.

I known that the last example is quite tricky, however, you have not to think about Promise like synchronous function, once they have been defined, we will call always the same definition of the Promise, while in functions, calling them will cause a new evaluation of them.

* On the contrary, **resubscribe** means recreate the previous Observable and execute all the operators inside it. Therefore, if the Observable is a side-effect one, it is not guaranteed that the same value will be observed by all the Observers attached to it. Let's consider a new example:

```typescript
class TimeInterval extends Observable<number> {
      public constructor(
            private readonly delay: number,
      ) {
            super((subscriber) => {
                  let value = 0;
                  const intervalId = setInterval(() => {
                        if (moment().seconds() < 40) {
                              subscriber.next(value++);
                        } else {
                              clearInterval(intervalId);
                              subscriber.complete();
                        }
                  }, this.delay);
            });
      }
}

const resubscribe$ = new TimeInterval(1000);

resubscribe$.subscribe({ next: (value) => console.log(`Observer 1 observes: ${value}`), });
setTimeout(() => resubscribe$.subscribe({ next: (value) => console.log(`Observer 2 observes: ${value}`), }), 5000)
```

we created a new Observable emitting values with a certain rate, until the seconds of the current instants are lower than 40, Then, we subscribed two different Observables in two different temporal instants. Unsurprisingly, the values observed by the Observers are different, although each Observer recreates a different Observable each time, because, the Observable depends on an external source (that is time in this case), non-deterministic, and then this is a perfect example of Hot Observable. The interesting part is the difference between the subscription action made here, from the replay in the previous example. In fact, while Promise are entities stored directly in memory and ready to use, Observables stores only the skeleton that must be re-evaluated. 

An interesting parallelism between Promises and Observables, and resubscribe and replay, is that a Promise is meal ready to eat which is the reply action, stored in your fridge, while Observable is a recipe that must be cooked with new ingredients, that is the resubscribe action, to get a meal. Moreover, the recipe is the lighter but not faster way to get a result, while the ready-to-eat dish occupy much more space in the fridge respect to the recipe, but it is ready.

## Measuring the temperature of an Observable
Another interesting way to understand when Observables are hot or cold is analyze where, in an Observable, is created the **Producer** which will emit those data. From a theoretical point of view, a Producer is no more that an entity that will notify to one or more Observers that some events has occurred. Now, if the Producer has the same scope of the Observable, it indicates that the Observable is a Cold one, that is, the source of events is created each time an Observer is subscribed. On the other hand, if the Producer does not have the same scope of the Observable, that is, is an external source of events that does not depends on the Observable, thus this is an Hot Observable.

Considering the following example:

```typescript
class Producer {

      private event: number = 0;
      private readonly observers: Subscriber<number>[] = [];

      public constructor() {
            setInterval(() => {
                  this.observers.forEach((observer) => observer.next(this.event));
                  this.event++;
            }, 1000);
      }

      public register(observer: Subscriber<number>) {
            this.observers.push(observer);
      }

}

const producer$ = new Producer();

class HotObservable extends Observable<number> {

      public constructor() {
            super((observer) => {
                  producer$.register(observer);
            });
      }

}

class ColdObservable extends Observable<number> {

      public constructor() {
            super((observer) => {
                  const producer$ = new Producer();
                  producer$.register(observer);
            });
      }

}
```

we have created two Observables known as `ColdObservable` and `HotObservable`, and a producer by the `Producer` class. The Producer will notify to each attached Observer, a new value every 1000ms. Moreover, in the `HotObservable` class, the Producer has been declared outside the Observable, thus, its lifecycle does not depends on the Observable itself, therefore, it started to emit events before the Observable has been created probably. On the other hand, the `Cold Observable` declares a new `Producer` each time a new Observer is attached, thus the new Observer will receive a new flux of events independently from the registration of the previous Observers, and then, the Producer's lifecycle depends on the current Observable.

In other terms, each time a new Producer is created, a new Stream of data is created, thus, in Cold Observables, to each Observer a personal data stream is created, therefore, more flexible way of dealing with data streaming, requires more resources respect to Hot Observables.

### Heating a Cold Observable

Up to this point, however, each operator that we saw create a Cold Observable, how can we create an How Observable using them? Well, we can simply create a new Observable object, whose Producer is outside the Observable itself, or we can use the `share` operator. `share` is also known as **hot-by-operator**, in meaning that starting from a Cold Observable, can reproducer the same Stream for another Observer, making the Observable an Hot one. Let's suppose that an Observable using `interval` is emitting a set of random values each 1000ms, we would like to create this Observable as an Hot Observable, and by using `share` we probably get something like this:

```typescript
const hotIntervaL$ = interval(1000).pipe(
      map(() => Math.random()),
      share(),
);
```

now, once a new Observer subscribes on the Observable, a new copy of the Stream with an internal state is created, thus, the value observed by the Observer is the current Stream's state, not the initial state like in Cold Observables. 

## Scheduling events
Every time we used `interval` or `delay` there is an internal artifact known as **Scheduler** that is used to run the Observable in a different way. Moreover, giving a more formal definition, a Scheduler is *an entity that defines in which execution context an Observable must be executed*, that is, defines how and when the Observable will be executed. From a technical perspective, the Scheduler is composed by the following components:

* A **data structure** where all the events are stored.
* An **execution context** determining where an when the events are executed.
* A **virtual clock** providing the notion of time for the Scheduler itself.

Moreover, in RxJs each Scheduler is based on the following interface:

```typescript
interface Scheduler {
      now(): number; // Current time for the Scheduler
      schedule(work, delay?, state?): Subscription; // Schedule a new work to be executed
      flush(): void; // Executes all the works in the queue
      active: boolean; // Indicates if the Scheduler is actually working or no
      actions: Action[]; // All the scheduled actions
      scheduledId: number;
}
```

Let's have a look on how the Scheduler works. Let's consider the following example, emitting a set of values using the `from` operator:

```typescript
console.log(`[${moment().locale('it').format()}] - Before the stream definition`);
from([1, 2, 3, 4, 5]).subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('Stream finished'),
});
console.log(`[${moment().locale('it').format()}] - After the stream definition`);
```

having a look to the console, the two logs before and after the stream are actually executed in the same order we saw. Moreover, you probably expect that the stream is executed asynchronously, that is not this case. How can we create the same stream in async mode? Well, we can pass a second parameter to `interval` that is a Scheduler. There are some built-in Scheduler in RxJs and the most common are: `asapScheduler` (asap means *As Soon As Possible*), that forces to execute the stream immediately in async mode; and `asyncScheduler` that executed the Observables in async mode when it is possible. Let's see how passing these two different Observables changes or not the normal Observable's behavior:

```typescript
console.log(`(intervalWithAsyncScheduler) [${moment().locale('it').format()}] - Before the stream definition`);
from([1, 2, 3, 4, 5], asyncScheduler).subscribe({
      next: (value) => console.log(`(intervalWithAsyncScheduler) - ${value}`),
      complete: () => console.log('Stream finished'),
});
console.log(`(intervalWithAsyncScheduler) [${moment().locale('it').format()}] - After the stream definition`);

console.log(`(intervalWithAsapScheduler) [${moment().locale('it').format()}] - Before the stream definition`);
from([1, 2, 3, 4, 5], asapScheduler).subscribe({
      next: (value) => console.log(`(intervalWithAsapScheduler) - ${value}`),
      complete: () => console.log('Stream finished'),
});
console.log(`(intervalWithAsapScheduler) [${moment().locale('it').format()}] - After the stream definition`);
```

As we can see from the console, both Observables are executed asynchronously that is, the values are printed idependently from the before and after log. Moreover, the numbers from the Observables with `asapScheduler` are always printed before the values of the Observable with `asyncScheduler`, because, the first scheduler has higher priority respect to the latter. 

However, the previous definition is deprecated, nowadays, there is an alternative and more generic operator to use instead of passing the Scheduler to the Observable, that is `scheduled`. As we can see from the documentation, `scheduled` requires two parameters, the former is the input Observable while the latter is the Scheduler that we would like to apply. Let's see how can we refactor the previous example using that new operator:

```typescript
function intervalWithScheduled<T>(observable: Observable<T>, scheduler: AsapScheduler | AsyncScheduler, schedulerName: string) {
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - Before the stream definition`);
      scheduled(observable, scheduler).subscribe({
            next: (value) => console.log(`(${schedulerName}) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - After the stream definition`);
}
```

using a generic function we are going to pass an Observable with generic types, moreover, the function accepts two different types of scheduler, created by the factory function `asapScheduler` and `asyncScheduler`. Executing the function with different type of Scheduler, we can see that the execution with `asapScheduler`, again, is always executed before the Observable with `asyncScheduler`.

Up to this point, we saw only two types of Scheduler, created by the factory function `asapScheduler` and `asyncScheduler`, moreover, there are other types of Scheduler, working on different execution context:

* The former is `queueScheduler` that puts in a queue the specified task without executing it immediately. Thus executing the two different tasks in the same queue is, more or less, executing them synchronously.
* The latter is `animationFrameScheduler` that executes a task just before the browser's next content is shown. We will not see this type of animation, because in strictly a front-end feature.

Finally, there is a different way to execute an Observable using a Scheduler, without using `scheduled` operator or passing the Scheduler as second parameter, that is using the `observeOn` operator inside the Observable's pipe. `observeOn`, in fact, requires as unique parameter the type of Scheduler that we would like to apply to the Observables, thus, we can rewrite once more the same previous example in the following way:

```typescript 
function intervalWithObserveOn <T> (observable: Observable<T>, scheduler: AsapScheduler | AsyncScheduler | QueueScheduler, schedulerName: string) {
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - Before the stream definition`);
      observable.pipe(
            observeOn(scheduler),
      ).subscribe({
            next: (value) => console.log(`(${schedulerName}) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - After the stream definition`);
}
```


## Testing Reactive Programs
Testing is a fundamental phase in enterprise application's development, and it is not wise to release a product without a robust testing pipeline. In this chapter, we will see how testing can be used to test asynchronous pipelines in RxJs, moreover, we will focus only on **unit testing** that is a set of testing statements for small application's part. One of the commonest framework for testing is [**Jest.js**](https://jestjs.io/) and we will use it for our examples, moreover, we will start from simplest testing scenario and going deeper diving into concepts like **Schedules**.

Indeed, this will be probably the first time that you are going to implement unit testing for asynchronous and functional code. If you have ever implemented tests for OOP, it will look a simpler task because as we will see, libraries like RxJs are based on Functional Programming, thus only with pure functions. In fact, while in OOP testing scenarios, side effects can have a massive impact on quantity and order of our test cases, pure functions should contain only small piece of code without any nesting conditions, and then, the body of a pure function must not depends on other external factors, that is it does no matter in which order we are going to execute the tests. 

Let's start considering the following example: an Observable emits a set of numeric values though a pipe that squares each values and them sum each of them, let's test this observable considering two different scenarios: the input set is empty; and the input set contains some elements:

```typescript
describe('test observable', () => {

      it('should returns 0, when the input set is []', () => {
            from([]).pipe(
                  map((value) => value * value),
                  reduce((acc, value) => acc + value, 0),
            ).subscribe({
                  next: (value) => {
                        expect(value).toEqual(0);
                  }
            });
      });

      it('should returns 55, when the input set is [1, 2, 3, 4, 5]', () => {
            from([1, 2, 3, 4, 5]).pipe(
                  map((value) => value * value),
                  reduce((acc, value) => acc + value, 0),
            ).subscribe({
                  next: (value) => {
                        expect(value).toEqual(55);
                  }
            });
      });

});
```

everything works correctly right? However, something is not working correctly, because we are using assertions without taking into account that the code is asynchronous. Let's make an update, adding a `delay` after each `reduce` operator, and changing one of the test with a failure condition, it is probable that the output is the same. Thus, how can we deal with asynchronous code? Fortunately, **Mocha** (the testing framework on which Jest is based on) provides a callback function to use in `it`  that is `done`. Technically, using `done` we indicating to Mocha that the code is not completed until the callback is called. Let's update the previous example with its correct form:

```typescript
describe('test observable', () => {

      it('should returns 0, when the input set is []', (done) => {
            from([]).pipe(
                  map((value) => value * value),
                  reduce((acc, value) => acc + value, 0),
            ).subscribe({
                  next: (value) => {
                        expect(value).toEqual(0);
                        done();
                  },
            });
      });

      it('should returns 55, when the input set is [1, 2, 3, 4, 5]', (done) => {
            from([1, 2, 3, 4, 5]).pipe(
                  map((value) => value * value),
                  reduce((acc, value) => acc + value, 0),
            ).subscribe({
                  next: (value) => {
                        expect(value).toEqual(55);
                        done();
                  },
            });
      });
});
```

now, if one assertion fails, the `done()` will not be triggered, thus, the entire suite will fail, showing which function success or not correctly.

### Testing with Scheduler and Marble Diagrams

Let's back to the Scheduler's chapter, and let's consider the following scenario: an Observable created using the `interval` operator, dispatches a set of 5 numbers starting from 0 to 4 each 200ms, we would like to test that Observable, thus, an acceptable solution can be something like this:

```typescript
describe(`Testing an Observable emitting values each 2s`, () => {

      const observable$ = interval(200).pipe(
            take(5)
      );

      it (`should emit values [0, 1, 2, 3, 4]`, (done) => {
            let currentValue = 0;

            observable$.subscribe({
                  next: (value) => expect(value).toEqual(currentValue++),
                  error: () => done.fail(),
                  complete: () => done(),
            });

      });

});
```

we did it, everything works correctly! Yep, that probably right, however, what is happening if we are changing the delay from 200ms to 10000ms? Well, the test still pass, however, the result will be shown after a long time, and things getting worse if the delay is about 10 minutes ... Now you probably realized that there is a problem, that is, the test depends on the real world time. However, as a famous professor states in the earlier 1900's *time is relative*, and in the same way it is for Observable, in fact, we can use a powerful tool to define how an Observable will emit values, without actually use the time dimension, that is use the **Marble Diagram**.

Testing with Marble Diagrams requires a missing piece, that answer the following question, how can we actually tell to Jest how a test is passed or not each time a value has been emitted? The answer is in the `TestScheduler` class, that requires a function with the expected and the actual value emitted from the Observable, and returns a new Scheduler. Let's see the following example:

```typescript
const aTestingFunction = (expected: number) => expect(expected).toBeDefined();
const anotherTestingFunction = (expected: number, actual: number) => expect(expected).toEqual(actual);

const scheduler = new TestScheduler((expected, actual) => {
      aTestingFunction(expected);
      aTestingFunction(actual);
      anotherTestingFunction(expected, actual);
});
```

we assign two testing functions to the variables `aTestingFunction` and `anotherTestingFunction`, and then instantiating a new `TestScheduler` we are indicating to the Scheduler when we can consider the test passed or not, for each emitted value from the Observable that it defined. Up to this point, where are the Marble Diagrams? We have not defined them yet, and this is the next step:

```typescript
const source$ = scheduler.createColdObservable('---a---b---c---|', {a: 1, b: 2, c: 3}).pipe(map((x) => x*2));
const expected$ = scheduler.createColdObservable('---A---B---C---|', {A: 2, B: 4, C: 6});
``` 

now using the scheduler, we created two Observables, the first one is a source emitting a number each 10 frames, flowing through a pipe that multiply each emitted value by 2, the latter is the expected Observable that we suppose to be produced by applying the `map` operator to the input source. Moreover, as we can see the Marble Diagram that we are creating is made of `-` representing a single **frame**, that is a time unit used to simulate real time, and then we are passing to the `createObservable` function another parameter that is an object mapping each value shown in the diagram with its actual value that will be emitted by the Observable. The character `|` represents the closing event of the Observable, don't be afraid because we will dive deeper in the symbols that can be used in the Marble Diagram. 

Finally, we can test that `source$` is equal to `expected$` by using the `expectObservable` function, calling all the assertions that we defined in the `TestScheduler` and running the Observable using the `scheduler.flush()` method:

```typescript
scheduler.expectObservable(source$).toEqual(expected$);
scheduler.flush();
```

thus, the final example is the following:

```typescript
it (`should emit values [0, 1, 2, 3, 4] using marbles diagram`, () => {
      const aTestingFunction = (expected: number) => expect(expected).toBeDefined();
      const anotherTestingFunction = (expected: number, actual: number) => expect(expected).toEqual(actual);
      const scheduler = new TestScheduler((expected, actual) => {
            aTestingFunction(expected);
            aTestingFunction(actual);
            anotherTestingFunction(expected, actual);
      });

      const source$ = scheduler.createColdObservable('---a---b---c---|', {a: 1, b: 2, c: 3}).pipe(map((x) => x*2));
      const expected$ = scheduler.createColdObservable('---A---B---C---|', {A: 2, B: 4, C: 6});

      scheduler.expectObservable(source$).toEqual(expected$);
      scheduler.flush();
});
```

I tried to use the [`AAA`](https://medium.com/@pjbgf/title-testing-code-ocd-and-the-aaa-pattern-df453975ab80) assertion pattern, however, if we move the `scheduler.flush()` from its original position, the testing suite will pass even if the assertions fails, because, we have to register first the assertions and the expectations, then we have to run Scheduler using the `flush` function, otherwise no assertions will be checked while the values flows in the Stream.

As I mentioned above, let's have a look at the symbols admitted in the Marble Diagram:

* `-` represents the passage of a single time unit known as **frame**.
* `|` represents the successful closing of the Observable.
* Errors are reported using `#`.
* `^` indicates that an Observable has been subscribed, and most of the time is used for Hot Observables.
* `!` indicates that a Subscription to the Observable has been cancelled.
