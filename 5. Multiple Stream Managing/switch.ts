import { Observable, interval, map, switchAll, take } from 'rxjs';
import { Post } from '../Database/post.interface';

const loading$ = interval(1000).pipe(
      map((value) => Math.round(Math.random() * value * 100)),
      map((value) => `System is loading ... ${value}% completed`),
);

const posts$ = new Observable<Post>((subscription) => {
      fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then((response) => response.forEach((post: Post) => subscription.next(post)))
            .catch((response) => subscription.error(response))
            .finally(() => subscription.complete());
});

loading$.pipe(
    map((_) => posts$),
    switchAll(),
    take(Math.floor(Math.random() * 10))
).subscribe({
    next: (post) => console.log(`New post loaded: ${post.title}`),
    error: (exception) => console.error(exception),
    complete: () => console.log('Request completed!'),
});