# Observable, Observer & Subscription

An **Observable** is the producer of a data source, there are different ways to create an observable using methods from rxjs, however, each of these methods refers to different a different caregory of data source that we can identify in:

- **Single Value Synchronous** like values returned from the evaluation of an expression, and whose observable can be created using the `of` operator.
- **Multi Value Synchronous** such as `String`, `Array` or any object that represents a sequential set of elements and show observable can be created using the `from` opearator.
- **Single Value Asynchronous** returned form an asynchronous operation such as a `Promise`, created using the operator `from`. However, a promise can return also an array or any set of elements, but, a Promise can be executed once, respect to an event that can be executed an undefined number of times, for this reason a Promise is considered a single value emitting source.
- Finally, **Multi Value Asynchronous** is the most cumbersome type of data, they are in fact a type of data source that can be emitted multiple times during the execution, with an undefined number of times. Most of the time, these types of data are represented from DOM events, or external events independent from our program, and can be wrapped in an observable using the `fromEvent` operator.

Once a data source is wrapped in an observable, it does not emitts any data until an **Observer** is attached to it. As soon as an observer is attached using the `subscribe` method, we can say that an observer has been subscribed to an observable entity, resulting in a new object known as **Subscription**, that is the combination of Observable + Observer + any eventually data pipe. However, we do not know how many times an observable will emit data to an observer, for this reason, we have to iterate over all the possible elements using the **Iterator** design pattern, needing a `next` method. Aside `next` there are two more methods called by the observable, these are `complete` and `error`. The former indicates the data emission's process is completed, while the latter indicates that an error occurred and no more data will be emitted.

<p align="center">
    <img src="../assets/Observable, Observer & Subscription.png" alt="Observer, Observable & Subscription" style="width:100%">
</p>

Up to this point, befor explaining the examples, we saw how create observables starting from some operators like `from`, `to` and `fromPromise`, however, how can we create a custom observable from our own? We can simply create a new observable by instantiating it, moreover, the `Observable` class is a generic one, requiring the type of the value emitted to the Observer attached to it, and the constructor function takes as input the `Subscriber` that will be attached, on which we can invoke the methods `next`, `error` or `complete`.

## Examples

- <i>Create a simple Observable that emitts an array of values, from 1 to 10, subscribe an Observer that prints each single value emitted from the former and print `complete` once the data flow is completed.</i>

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
