# Observable, Observer & Subscription

This first chapter is an introduction of **Observable**, **Observer** and **Subscription**, the tree elements that in RxJs compose a **Stream**, we will see how these three theoretical concepts works together in RxJs and the different ways that creates Observables.

## Observable and Stream Creation

The Observable is the core of RxJs, it can be defined as an Event's Producer, that is the starting point of the Stream. There are different ways of create an Observable, that defines the nature of the Observable itself. The simplest Observable is one that emits only a single value, there are two factory methods in RxJs that can create a single-value Observable:

- the `of` operator that creates a synchronous Observable, passing as argument the value that will be emitted immediately.
- in previous versions of RxJs there was the `fromPromise` operator to create a single value Observable that emits that value is async way, however, in modern versions of RxJs, thus in this version, there is no more that operator, on the other hand, there is the `from` operator.

we saw the operators that can be used to create a single-value Observable, however, in your daily experience you will probably work with Observables that emits multiple events, there are two operators that can create Observables like these:

- we saw that `from` can create a single-value async Observable, on the other hand, can also create a multiple-value synchronous Observable, just passing an Iterable object to it. Thus, each event in the Iterable structure will be emitted immediately.
- the last operator that we are going to see is `fromEvent` and is the most cumbersome. This operator requires an external event emitter like DOM Events or Event Emitters in Node.js, thus an external source of events, that emits those one in an uncontrolled way respect to who is listening.

Let's see some examples of how these operators can be used, you will find them in [`observables-factory-functions.ts`](./observables-factory-functions.ts):

```typescript
type Data = {
      date: string;
      value: number;
};

of({ date: moment().format(), value: Math.random() }).subscribe({
      next: ({ date, value }: Data) => console.log(`(Sync - Single Value) [${date}] - ${value}`),
});
```

the first one is the simplest and shows how we can create a single-value synch Observable using the `of` operator. In this case, we are passing to the operator an instance of `Data` which is a custom type, as soon as the of operator is triggered, the value is shown in the console.

```typescript
const dataPromise = new Promise<Data>((resolve, _) => {
      setTimeout(() => resolve({ date: moment().format(), value: Math.random() }), 1000 * Math.random());
});

from(dataPromise).subscribe({
      next: ({ date, value }: Data) => console.log(`(Async - Single Value) [${date}] - ${value}`),
});
```

the second example is more cumbersome respect to the former, in fact, we have to create an async source (in this case is a simple Promise) and next pass it to the `from` operator. Of course, due to the async nature of the Promise, we cannot expect that the value will be emitted as soon as a Consumers subscribes to the Producer, just like in the previous example.

```typescript
function* multipleSync<T>(elems: T[]) {
      for (const value of elems) {
            yield value;
      }
}

from(
      multipleSync<Data>([
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
            },
      ]),
).subscribe({
      next: ({ date, value }: Data) => console.log(`(Sync - Multiple Value) [${date}] - ${value}`),
});
```

as example of a single-value Synchronous Observable I chose to use a [**Generator Function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), of course this is not mandatory, we can pass any iterable data structure to `from` whose result is the emission of each value in the data structure as they are placed. In this case each value passed as parameter to `multipleSync` are shows in the console is the exact order as they are passed as parameters.

```typescript
const multipleAsync = new EventEmitter();

fromEvent(multipleAsync, 'number').subscribe({
      next: (event) => console.log(`(Async - Multiple Value) ${event}`),
});

multipleAsync.emit('number', 1);
multipleAsync.emit('number', 1);
setTimeout(() => multipleAsync.emit('number', 3), 1000);
multipleAsync.emit('number', 2);
```

finally, the last example shows hoe can we use the `fromEvent` operator. Since I'm going to use Node.js I have to use as data source an **Event Emitter**(https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter). After that the Consumer subscribes to the Observable, three values are emitted from the Event Emitter, then later a new value is emitted and caught by the Producer.

One of the main differences between the examples with Async and Synch Observables is that, in the former we know when the Observable stops to emit values, because the data structure if finite, while in the latter case we can't known when the source will stop to emit new values, therefore, the Producer will listen for new values maybe forever if we are not indicating to it that to stop listening. Keep in mind this difference between the two Observable's types for later examples.

## The data consumer or Observer

In the previous section we saw different ways to create different types of Observables. Of course an Observable is useless if none is listening for events that it emits, moreover, the listener of events is also known as **Observer** or **Consumer**. If you have a look at the implementation of an Observable, you can see that there is a method called `subscribe` that ables us to attach (literary subscribe) an Observer to an Observable.

Thus, what is an Observer? From a theoretical point of view, as we saw is a listener of events emitted by an Observable, from a technical perspective, on the other hand, in RxJs is a simple object implementing the `Observer<T>` generic interface. As we can see:

```typescript
export interface Observer<T> {
      next: (value: T) => void;
      error: (err: any) => void;
      complete: () => void;
}
```

the Observer interface is quite simple and contains only three methods of each type of event that an Observable can emit:

- `next` is used by the Observable to emit each produced value.
- while exceptions are notified and managed in the `error` method. Differently from `next` it is no possible to infer the type of the thrown error. Of course, once an exception is thrown, is stream is forced to be closed.
- finally, `complete` is used to notify that the stream has no more values.

Let's see now can we attach an Observer to an Observable, let's consider the following scenario implemented in [**observer.ts**](./observer.ts): *an Observable is emitting a set of values, each time a new value is emitted, the Observer shows it in the console, with the current timestamp and the name of the Observer*. 

```typescript
from([1, 2, 3, 4, 5, 6, 7, 8, 9]).subscribe(
      new CustomObserver('Custom Observer')
)
```

using `from` we are creating a multi-value synchronous Observer made by a set of numbers, the using `subscribe` we are attaching a custom Observer to the created Observable. Our custom Observer is a new class implementing the Observer interface like shown below:

```typescript
class CustomObserver implements Observer<number> {
      public constructor(
            private readonly name: string,
      ) { }

      public next(value: number) {
            const currentTimestamp = moment().format();
            console.log(`${this.name} [${currentTimestamp}] - event: ${value}`);
      }

      public error () {
            console.error('An error occurred');
      }

      public complete () {
            console.log('No more events');
      }

}
```

of course, since it is a custom Observer we are giving a name passed through the constructor, then in the `next` method we have implemented the logic described in the scenario. However, I decided to create a custom Observer to show you an alternative way to attach an Observer to an Observer, but, most of the time, you will not need to create an Observer like this, what do you need is just an Object containing these three methods.

Do we need each of the three methods? Well, in the previous example I implemented them in the Observer, but I did not need them, luckily in RxJs it is also possible to attach a **Partial Observer** to an Observable, that is, an Observer without one or more of the three methods shown in the Observer interface. Thus, the previous example can be rewritten using only a partial Observer like this:

```typescript
from([1, 2, 3, 4, 5, 6, 7, 8, 9]).subscribe({
      next: () => {
            const name = 'Custom Observer';
            const currentTimestamp = moment().format();
            console.log(`${name} [${currentTimestamp}] - event: ${value}`);
      }
})
```

Once an Observer subscribes to an Observable and there are no more events that can be emitted by the Observable, what happens to the Observer, does it still requires resources or it is discarded automatically? In the next section we will see how can we manage this situation, and how RxJs does it for us.

## The result of an Observer's subscription

Once an Observer subscribes to an Observable using `subscribe`, a **Subscription** object is returned. A Subscription is no more that the resource that is attached to the Observable and that can be disposed to release resources. There is only one important method in Subscription, that is `unsubscribe`, forcing to release the resource event before that the Observable finishes to emit events.

In **subscription.ts** there is a simple example of how can you use a Subscription. Consider not two Observables that emits two different set of values:

```typescript
from([1, 2, 3, 4]).subscribe({
      next: (value) => console.log(`First Observable emits - ${value}`),
});
from([5, 6, 7, 8]).subscribe({
      next: (value) => console.log(`Second Observable emits - ${value}`),
});
```

once the Observable stops to emit events, we have to unsubscribe the Observers, thus we have to assign the result of `subscribe` to two different variables:

```typescript
const aSubscription$ = from([1, 2, 3, 4]).subscribe({
      next: (value) => console.log(`First Observable emits - ${value}`),
});

const anotherSubscription$ = from([5, 6, 7, 8]).subscribe({
      next: (value) => console.log(`Second Observable emits - ${value}`),
});
```

then, we can call the `unsubscribe` to each of these Subscription `aSubscription$` and `anotherSubscription$`:

```typescript
aSubscription$.unsubscribe();
anotherSubscription$.unsubscribe();
```

now the resources has been released and there are no more problems for [**Memory Leaks**](https://en.wikipedia.org/wiki/Memory_leak), of course this is a serious problem in applications that use Reactive Programming, we will discuss about this problem in later chapters. However, do you noticed that we used `$` as prefix for each variable? That is a unwritten guideline that it is not mandatory, but helps who is reading that that variable represents the Subscription of an Observable named as the variable.

An Observable's lifespan starts as soon an Observer completes the subscription, until none is subscribed no values are emitted from the Observable. This mechanism is known as **Lazy Evaluation** that we can recap as "do not allocate resources until they are needed, and if they are needed now, allocate only the necessary", Haskell is a functional language that is based on this principle. On the other hand, JavaScript and most of programming languages uses the **Eager Evaluation**, that is "evaluate and allocate the resources that will be needed from the application prior".

## Examples

- <i>Create a simple Observable that emits an array of values, from 1 to 10, subscribe an Observer that prints each single value emitted from the former and print `complete` once the data flow is completed.</i>

Using the function `from` we can create an Observable passing as parameters an array of values from 1 to 10, then using the `subscribe` function we pass a new Observer that print each value emitted by the Observable:

```typescript
from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).subscribe({
      next: (value) => console.log(value),
      error: (error) => console.log(error),
      complete: () => console.log('complete'),
});
```

- <i>Create a custom Observable that returns a random sequence of number every second. If the number is current number to emit is greater then 0.5 and the number of seconds passed since the first vale has been emitted is greater then 5, then throw an error, otherwise notify to the Observer that the values are finished.</i>

This is a quite tricky example, because requires knowing concepts of recursion and closure in JavaScript, however, the tricky part consists in defining a new Observable, that calls the Observer functions `next`, `error` and `complete`:

```typescript
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
```

doubs regarding value emissions and infinite loops will be clarified in the next chapter.

- <i>Create in two separate files an Observable and an Observer. The Observable is a promise making an HTTP call to the following [`endpoint`](https://jsonplaceholder.typicode.com/posts), while the Observer prints the JSON data in a prettier format.</i>

Finally, for the last example let's have a look at each file separately. The Observable is defined inside the file [http-request.observable.ts](./http-request.observable.ts), containing a new class extending the base class `Observable` and emitting data of custom types, and using the `fetch` method implemented in JavaScript:

```typescript
export class MakeHttpRequest extends Observable<RequestFormat> {
      public constructor() {
            super(MakeHttpRequest.emitData);
      }

      private static emitData(observer: Subscriber<RequestFormat>) {
            fetch('https://jsonplaceholder.typicode.com/posts')
                  .then((response) => response.json())
                  .then((posts: Array<RequestFormat>) => {
                        for (const post of posts) {
                              observer.next(post);
                        }
                        observer.complete();
                  })
                  .catch((exception) => observer.error(exception));
      }
}
```

the important part is that we are invoking the super constructor of the base class using the `super` operator and passing a custom method that takes as parameter the attached Observer.

On the other hand, the observer defined in [json-formatter.observer.ts](./json-formatter.observer.ts) implements the interface `Observer` receiving the same type of data emitted from the Observable:

```typescript
export class JsonFormatter implements Observer<RequestFormat> {
      public next(value: RequestFormat) {
            console.log(`[${value.id}] - ${value.title} ${value.body}`);
      }

      public error(err: any) {
            console.error(err);
      }

      public complete() {
            console.log('Data flow finished');
      }
}
```

splitting the definition of the elements in different files, we can create the stream in this way:

```typescript
new MakeHttpRequest().subscribe(new JsonFormatter());
```
