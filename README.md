# Reactive Programming

Starting from the basis, let's consider the following scenario, you have to make an http request to the server, involving updating users' data, let's suppose that this is done by a function and then, once the server answer with a successfull response, you have to update the UI using another function. The resulting code will be something like this:

```javascript
const response = updateUserData(userData);
updateUI(response);
```

what is the problem of this code? Well, it is executed **synchronously**, that is, the user must wait the termination of the previous functions before continuing in its tasks. Of course, this is not a suitable scenario for most applications, and due to the JavaScript's single-thread nature, we do not have any built in contructor that helps us in create an asyncronous piece of code. 

Luckly, JavaScript provides **callbacks** functions, to handle long-running operations that must be executed asynchronously. We can pass a callback functions as parameters that will be executed once the operation has been completed. From a theoretical point of view, the callbacks perform what is known as **inversion of control**, meaning that the execution's flow is passed to the function once it is invoked and then returned to the application's main flow. 

However, callbacks are not a suitable solution for error handling and conditional operations, because the require to nest the code, like this:

```javascript
updateUserData(userData, response => {
    if (response.status === 200) {
        updateUI(response, () => {
            showMessage('Success!');
        });
    } else {
        updateUI(response, () => {
            showMessage('Error');
        });
    }
});
```

moreover, callback share the same state of the application when they are called they are **side-effect** functions, and, of course, we would like to minimize the use of side-effect functions using only **pure** functions.

Starting from the ES6, JavaScript helps us with **Promise**. A Promise is a data type that wraps asynchrous code and uses two callbacks to handle success and failure, meaning that our code can be written again a better way:

```javascript
updateUserData(userData)
    .then(result => updateUI(result))
    .then(result => showMessage(result))
    .catch(error => showMessage(error));
```

now our code seems prettier right? However, there are some things that can be improved, in fact, promise's error's does not allows us to handler multiple error. Moreover, we cannot stop the execution of a promise once it is launched, causing a serious missing when we are dealing with HTTP calls, that can be stopped. 

Therefore, we need a new paradigm to handle asynchronous code, focusing on pure functions that does not updates the internal state of the application, and whose execution sequence can be defined by the programmer like in synchronous code. The **reactive paradigm** can help us, because it focuses on merging asynchronous executions with **functional paradigm** elements, allowing us to deal code like a data flow where pure functions are used to define each step of the flow.

## RxJs Library

RxJs is the achronism for **Reactive Extension for JavaScript** and is a useful library based on functional and reactive programming paradigm, focusing on threating data as an unique flow to be consumed, known as **stream**. Moreover, RxJs uses well known patterns like **Observer** and **Iterator**. 

The first and most important step is switching our mindset from the classic imperative approach to the reactive one, let's consider the following example:

```javascript
let a = 1;
let b = 2;
let c = a + b; // c = 3
a = 2; 
```

what is the value inside the variable `c` after the assignment `a = 2`?  Of course is `3`, nothing special right? However, in the reactive approach is will be `4`, let's see in the following example:

```javascript
let a$ = [1];
let b$ = [2];
let $c = a$.merge(b$).reduce((curr, next) => curr + next, 0);
```

`a$`, `b$` and `c$` are no more simple variables, now these are streams, moreover `c$` is the stream created by merging `a$` and `b$` whose value is the result of the sum of all the merged streams. Therefore, since streams are any data flow, any update to the `a$` or `b$` are reflected to the `c$` stream, thus if we change `a$` to the value `[2]`, `c$` will contain the value `[4]`. Notice that in the reactive programming, any stream is indicated using the `$` symbol for convention.

### Architectural Concepts

RxJs works on **stream** that is the data flowing process between the source who emitts data and who is observing the emitted values, between these two entities there is a **pipeline**, that is a set of operators that can be performed between the emission of the data and the observation of them. 

Respect to Promise, a stream is a **lazy data flow**, meaning that it will start to emit values and listen for them, only if someone has been registered and is observing the emitted values, on the other hand, a Promise starts to emit values as soon as is triggered in the normal program's execution flow.

Moreover, a stream does not depends on the program's execution flow, that is, it can be triggered many times in the future and will stop its execution only when no one is observing no more. 

In the following figure, we can see the representation of a stream and its components: 

<p align="center">
    <img src="./assets/Architectural Concepts.png" alt="Architectural Concepts" style="width:70%">
</p>

* The **observable** is the source of the data that emit values and whose can be observed, thecnically, it is known also as **producer**.

* The values emitted by the observable flows in a **pipe** where some **operators** can be used to transform data before reaching their final destination. There is no limit on the number of operators that can be add in a pipe, moreover, the operators are pure functions as in functional programming.

* Last, the entity who is observing values emitted by the observable is the **observer**, knwon as the **consumer**.

As you can see, the data can flow starting only from the producer and reaching the consumer as final destination, it is not possible to create an alternative flow. Moreover, as you can see, once a consumer is attached looking for values emitted by a producer, the values can be emitted in time indepedently by the program's main flow.