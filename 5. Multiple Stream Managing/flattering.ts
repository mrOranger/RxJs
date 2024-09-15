import { Observable, concatMap, map, mergeMap, range, switchMap } from 'rxjs';
import { Post } from '../Database/post.interface';

const numbers$ = range(1, 2);

const post$ = function (postId: number) {
      return new Observable<Post>((subscription) => {
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                  .then((response) => response.json())
                  .then((response) => subscription.next(response))
                  .catch((response) => subscription.error(response))
                  .finally(() => subscription.complete());
      });
};
numbers$
      .pipe(
            mergeMap((number) => post$(number)),
            map((post) => post.title),
      )
      .subscribe({
            next: (value) => console.log(`Merge Map ${value}`),
      });

numbers$
      .pipe(
            concatMap((number) => post$(number)),
            map((post) => post.title),
      )
      .subscribe({
            next: (value) => console.log(`Concat Map ${value}`),
      });

numbers$
      .pipe(
            switchMap((number) => post$(number)),
            map((post) => post.title),
      )
      .subscribe({
            next: (value) => console.log(`Switch map ${value}`),
      });
