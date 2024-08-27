import { from } from "rxjs";

const httpPromise = new Promise((resolve, reject) => {
    fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error));
});

const httpSubscription$ = from(httpPromise)
    .subscribe({
        next: (response) => console.log(response),
        complete: () => console.log('Request completed.'),
    });

httpSubscription$.unsubscribe()