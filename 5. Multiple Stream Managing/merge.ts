import { Observable, map, merge, scan } from 'rxjs';
import { User } from '../Database/user.interface';
import { Post } from '../Database/post.interface';

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
})