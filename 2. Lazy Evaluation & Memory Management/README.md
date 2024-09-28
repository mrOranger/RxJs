# Lazy Evaluation & Memory Management

Let's consider a simple HTTP call made by our web application, while data are fetching from the server, the user navigate back to the previous page, what will happen to the previous call? Do we still need to keep allocated the memory resources used for the call? Well, the answer is of course no, however, how can we indicate to the browser to stop the call and free the resources? Unluckily we cannot do that, on the other hand in <u>RxJs Observables have a deterministic lifespan that we can stop as soon as we need it</u>. 

An Observable's lifespan starts as soon an Observer completes the subscription, until none is subscribed no values are emitted from the Observable. This mechanism is known as **Lazy Evaluation** that we can recap as "do not allocate resources until they are needed, and if they are needed now, allocate only the necessary", Haskell is a functional language that is based on this principle. On the other hand, JavaScript and most of programming languages uses the **Eager Evaluation**, that is "evaluate and allocate the resources that will be needed from the application prior". There is another mechanism used by Rxjs to avoid premature allocation of data in conjunction with Lazy Evaluation, that is emitting values as soon as an event is triggered without storing the value in memory, preventing memory growth that can cause **Memory Leak**

## Memory Release

Another peculiarity of RxJs is the ability to release memory resources explicitly after the subscription process. The memory release process is done by the `Subscription` object, returned from the Observable after that a Observer has been subscribed, and using the `unsubscribe` method. Once the method has been invoked, the Observable will stop the emission of new values and all the Observer be automatically detached, releasing the memory resources that they were using. 

Thus, once we created an Observable, we are responsible of releasing the resources explicitly, moreover, if we are creating a custom Observable, we have to implement the un-subscription process otherwise the resources won't be released by the Garbage Collector. However, most of the time you will not care about resources releasing process because RxJs does it for you.

##

- <i>Create an Observable that makes an HTTP call to the [`endpoint`](https://jsonplaceholder.typicode.com/posts), however, as soon as the Observer has been subscribed you have to unsubscribe it immediately. The Observer will print the emitted value and a log message if the data flow is finished.</i>

Let's create a new Promise using the `fetch` method, we want to create the new Promise instead using the function because fetch returns another Promise containing the response's body.

```typescript
const httpPromise = new Promise((resolve, reject) => {
    fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error));
});
```

let's create now the Observable using the `from` method, and attach the Observer to the Subscription result:

```typescript
const httpSubscription$ = from(httpPromise)
    .subscribe({
        next: (response) => console.log(response),
        complete: () => console.log('Request completed.'),
    });
```

immediately after these lines of code, we have to unsubscribe the Observer:

```typescript
httpSubscription$.unsubscribe()
```

You probably notice that noting will be printed because most of the time, the HTTP call is slower that the program's execution, therefore the stream will be closed prematurely. The important thing to notice is that the HTTP will be stopped as soon as we invoke the `unsubscribe` method respect to Promise where the code will be wait for a result or an error.
