# Error Handling in RxJs

Inevitably, errors occur in RxJs just like in normal JavaScript programs, however, differently from normal programs wrote all with synchronous functions, in JavaScript and TypeScript, asynchronous function are the standard, meaning that handle errors with normal `try-catch` block in callback functions is a nightmare.

Error handling in Imperative way has many drawbacks in Reactive Programming:

- Functions throwing an error cannot be composed or chained like other pure functions, because their returning value is actually unknown.
- Throwing an error means create another exit path from our function, that is represents an undesirable side-side effect, that we would like to avoid in Reactive Programming approach.
- New responsibilities are moved to the programmer that have to face with all the possibles pieces of code that can throw an error.
- `try-catch` blocks do not avoid creation of nested code, especially when different actions must be done when an error occurs.

## The RxJs way to handle errors

RxJs manage errors in different ways, the most common is encoded in the Subscriber at the end of the Stream. In fact, the Subscriber implements the `Observer` interface, containing these three methods: `next`, `complete` and `error`. The latest method catches any error that occurred in the normal Stream's flow. In fact, in normal scenarios, any error is treated as a normal value that is flowing through the Pipe to the Subscriber.

Let's check the following example:

```typescript
function streamLimit(limit: number) {
      const standardizedLimit = (limit - Math.random()) / limit;
      return interval(500)
            .pipe(
                  map(() => parseFloat(Math.random().toPrecision(2))),
                  map((value) => {
                        if (value > standardizedLimit) {
                              throw new Error(`${value} is not a valid number for limit ${standardizedLimit}!`);
                        }
                        return value;
                  }),
            )
            .subscribe({
                  next: (value) => console.log(`A new value is emitted - ${value}`),
                  error: (exception) => console.error(exception),
                  complete: () => console.log(`The stream has been closed!`),
            });
}
```

we created a normal Stream emitting a random value each 500ms, after mapping the value in another `map` we are going to check if the value exceeds or not our standardized limit, that is a number between 0 and 1. If the current emitted value exceeds the input limit, an `Error` object is thrown, triggering the `error` function and stopping the Stream's normal flow, without triggering the `complete` function. Moreover, the value that causes the error, will skip any intermediate operator flowing directly to `error`.

### Catching exceptions with `catch`

In the previous example, once the error is detected and the exception is thrown, the Stream's main flow is interrupted. However, we would like that our application would be **resilience**, that is, continues to stay responsive even after an error occurred. Like in normal try-catch blocks, there is a similar operator in RxJs that ables us to capture errors once they are recognized, that is `catchError`.

Let's consider the following scenario: a source emits a sequence of **Transaction** representing a credit card payment, each time the Transaction flows in the Stream, the amount of the transaction is checked using a fixed daily limit. If the limit is exceeded, a label named `rejected` is appended to the Transaction, and then the new Transaction can flow through the normal Stream's flow.

```typescript
interval(1000).pipe(
      map((value) => ({ id: value, date: new Date().toISOString(), amount: 1000 * Math.random() })),
      map((transaction: Transaction) => {
            if (transaction?.amount > dailyLimit) {
                  throw new DailyLimitExceededException(
                        `Transaction ${transaction.id} exceeds the daily limit ${dailyLimit}`,
                        transaction,
                  );
            }
            return transaction;
      }),
      catchError((exception: DailyLimitExceededException) => {
            console.error(exception.message);
            exception.transaction.rejected = true;
            return of(exception.transaction);
      }),
      map((transaction) => ({ ...transaction, date: new Date(transaction.date).toLocaleDateString() })),
);
```

examining the example, each 1s a new value is emitted and represents the Transaction's id, then a random amount is generated. Then, the next `map` operator checks if the transaction amount exceeds or not the input daily limit represented by the variable `dailyLimit`. If the limit has been exceeded, a custom exception named `DailyLimitExceededException` is thrown. Next, since an exception has been detected in the Stream's normal flow, `catchError` is triggered, logging the corresponding error's message, appending the flag `rejected` to the exception and returning a new Observable containing the new updated Transaction. Remember that in a pipeline the values that flows in it are actually Observables, not single values. Finally, the local date of the current Transaction that can be rejected or not, is updated to the current's locale format.

Finally, wrapping this Observable in a custom function named `transactionsStream`, and observing the values flowing from the source through the Stream, each Transaction information is shown in the console log, just like in this way;

```typescript
transactionsStream(500).subscribe({
      next: (transaction: Partial<Transaction>) => {
            if (!transaction.rejected) {
                  console.log(`Transaction ${transaction.id} [${transaction.date} - ${transaction.amount}] accepted!`);
            } else {
                  console.log(
                        `Transaction ${transaction.id} [${transaction.date} - ${transaction.amount}] has been rejected!`,
                  );
            }
      },
      error: (exception) => console.error(`An error has been thrown ${exception}`),
      complete: () => console.log('The stream is closed'),
});
```

The completed example in show in [`catch.ts`](./catch.ts), however, notice that `catchError` has been placed immediately after the operator that can throw the exception. There are no problems, in this specific example, if `catchError` is not placed immediately after the possible source of exception, however, in real scenarios, in the `catchError` an alternative business logic is implemented, such as a value that must be rounded, if the error is not caught immediately and solved correctly, new errors can occur during the Stream's flow, causing an unexpected behavior of the Stream.

### Retrying operations with `retry`

After that an operation has failed, instead of close the stream and dealing the error we can retry the failed operation if there is a chance that in the next iteration, the same operation can be success. Suppose that we made an HTTP call that has failed, once the exception in thrown, we would like to make another HTTP hoping that this time the operation will be successful. To simplify the example, we will create two Observables once that will fail and another one that will success:

```typescript
const getUsersDataFail$ = of<IHttpResponse>({ response: 'Ok', code: 400 });
const getUsersDataSuccess$ = of<IHttpResponse>({ response: 'Ok', code: 200 });
```

now, the stream will checks if the response of the request was successful, otherwise, a new attempt will be made for 3 times, just like in the following way:

```typescript
http$.pipe(
      map((response) => {
            console.log('Try to get the user data');
            if (response.code !== 200) {
                  throw new Error(`Fail to fetch data with`);
            }
            return response;
      }),
      retry(3),
      catchError((exception: Error) => {
            console.error(exception.message);
            return of({ response: 'Suspended', code: 300 });
      }),
).subscribe({
      next: (response) => console.log(`Response ${response.response} with status ${response.code}`),
      error: (exception) => console.error(exception),
});
```

for the successful operation the output will be immediately positive, while for the unluckily one, four `Try to get the user data` will be saw in the console, and finally the intermediate value with status code 300 will reach the end of the Stream, before its closing.

In previous versions of RxJs, `retryWhen` was used to implement a more reactive retry mechanism not based just on fixed count of retries. Nowadays, `retryWhen` has been replaced with a more sophisticated implementation of `retry`, accepting an alternative parameter of type `RetryConfig`:

```typescript
interface RetryConfig {
      count?: number;
      delay?: number | (error: any, retryCount: number) => ObservableInput<any>;
      resetOnSuccess?: boolean;
}
```

let's rewrite the same previous example, using the overload of the function retry, passing as number of maximum attempts 3 and with a delay of 2s between an attempts and another:

```typescript
http$.pipe(
      map((response) => {
            console.log('Try to get the user data');
            if (response.code !== 200) {
                  throw new Error(`Fail to fetch data with result ${response.code}`);
            }
            return response;
      }),
      retry({ count: 2, delay: 2000 }),
      catchError((exception: Error) => {
            console.error(exception.message);
            return of({ response: 'Suspended', code: 300 });
      }),
).subscribe({
      next: (response) => console.log(`Response ${response.response} with status ${response.code}`),
      error: (exception) => console.error(exception),
});
```

the result is more or less the same, however, the values that will be shown in the console are quite different, in fact, we will see three times the string `Try to get the user data`, and then the final result that is the default response `Suspended` with status code 300. In real world scenario, `retry` is such a powerful operator, for example, supposing that our application will be used by a set of users not having a good internet connection, controlling an HTTP making it at most three times if it is not successful, results in a good improving of the User Experience, without make the user conscious that some requests were failed.

### Finally the `finalize` operator
Up to this point, the last operator that acts like a bridge between Imperative Programming way to handle exceptions and Reactive Programming is the corresponding operator for the **finally**  keyword, that is nothing more than the operator `finalize`. Just like `tap` it is a side-effect operator accepting a procedure (a function that returns `void`) as parameter and executes it, that is, we can consider `tap` and `finally` as side-effects operator. In fact, just like **finally** in programming languages such as Java or C#, `finally` in RxJs is used to execute operators after that an exception is thrown.

Let's see a basic example of how this operator works: considering a source that emits a set of data continuously like a sensor, of course, some data can be lost and in this case nothing terrible happens, however, if three or more errors occur, it means that the sensor is broken. Up to this point, we would like to thrown an exception, catch it and return a standard message indicating that an error occurred and finally, notify to the Observers that the stream is closed due to a technical failure:

```typescript
interval(500).pipe(
      map((value) => ({ id: '0015872a-e39d-4831-9cb3-9ade5a98a94f', data: moment().toISOString(), temperature: Math.max(0, Math.random() * 10) - value })),
      map((sensorData: ISensorData) => {
            if (sensorData.temperature < 0) {
                  throw new Error(`Invalid data temperature in ${sensorData.data} from sensor ${sensorData.id}`);
            }
            return sensorData;
      }),
      retry({ delay: 1000, count: 3 }),
      catchError((exception: Error) => {
            console.error(exception.message);
            return of<ISensorData>({ id: '0015872a-e39d-4831-9cb3-9ade5a98a94f', data: moment().toISOString(), temperature: NaN });
      }),
      finalize(() => console.log('Closing input stream due to technical failure ...')),
).subscribe({
      next: (sensorData) => {
            if (!isNaN(sensorData.temperature)) {
                  console.log(`Received ${sensorData.temperature}° from sensor ${sensorData.id} in ${sensorData.data}`);
            }
      },
      error: () => console.error(`An exception has occurred ...`),
      complete: () => console.log('Sensor has been closed ...'),
});
```

each 500ms a new input value containing the temperature is emitted from our source, since the sensor cannot detect negative temperatures, once a value lower than 0 is received an error is thrown. However, data can be corrupted from the source during the transmission, therefore we use `retry` to execute another attempt at more 3 times, if the number of attempts has been exceeded, a fake value is emitted from `catchError` and then using the `finalize` we shutdown the sensor immediately.
