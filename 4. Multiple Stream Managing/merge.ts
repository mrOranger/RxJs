import { Observable, interval, map, merge, mergeWith, scan } from 'rxjs';
import { User } from '../Database/user.interface';
import { Post } from '../Database/post.interface';

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

first$.pipe(
      mergeWith(second$),
).subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('complete'),
});

interface Event {
      name: 'mouse' | 'keyboard';
}

interface MouseEvent extends Event {
      xAxis: number;
      yAxis: number;
};

interface KeyboardEvent extends Event {
      key: string;
};

function createObservable<T extends Event>(factoryFunction: () => T) {
      return new Observable<T>((subscription) => {

            function emitValue() {
                  let intervalTimeSpan = Math.random() * 1000;

                  const timeoutRef = setTimeout(() => {
                        subscription.next(factoryFunction());
                        clearTimeout(timeoutRef);
                        emitValue();
                  }, intervalTimeSpan);
            }

            emitValue();

      });
}

const mouse$ = createObservable<MouseEvent>(() => ({name: 'mouse', xAxis: Math.random(), yAxis: Math.random()}));
const keyboard$ = createObservable<KeyboardEvent>(() => ({name: 'keyboard', key: String.fromCharCode(Math.floor(Math.random() * 1000))}));

mouse$.pipe(
      mergeWith(keyboard$),
).subscribe({
      next: (event) => {
            if (event.name=='keyboard') {
                  const keyboardEvent = event as KeyboardEvent;
                  console.log(`Mouse event (key: ${keyboardEvent.key})`);
            } else {
                  const mouseEvent = event as MouseEvent;
                  console.log(`Keyboard event (x: ${mouseEvent.xAxis}) (y: ${mouseEvent.yAxis})`);
            }
      }
})

const aSequenceWithException = interval(1000).pipe(
      map((value) => {
            if (value > 10) {
                  throw new Error('Value is greater than 10!');
            }
            return value;
      }),
);

const aSequence = interval(500);

merge(aSequenceWithException, aSequence).subscribe({
      next: (value) => console.log(value),
      error: (error: Error) => console.log(error.message),
      complete: () => console.log('Sequence complete!'),
});

merge(aSequenceWithException, aSequence).subscribe({
      next: (value) => console.log(value),
      error: (error: Error) => console.log(error.message),
      complete: () => console.log('Sequence complete!'),
});

const posts$ = new Observable<Post>((subscription) => {
      fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then((response) => response.forEach((post: Post) => subscription.next(post)))
            .catch((response) => subscription.error(response))
            .finally(() => subscription.complete());
});

const users$ = new Observable<User>((subscription) => {
      fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((response) => response.forEach((user: User) => subscription.next(user)))
            .catch((response) => subscription.error(response))
            .finally(() => subscription.complete());
});

const postsUsersIds$ = posts$.pipe( map((post) => post.userId) );
const usersIds$ = users$.pipe( map((user) => user.id) );

merge(usersIds$, postsUsersIds$).pipe(
      scan((acc, user) => acc.concat(user), new Array<number>()),
      map((ids) => ids.filter((id, index) => ids.indexOf(id) === index)),
).subscribe({
      next: (ids) => console.log(ids),
      complete: () => console.log('complete'),
});
