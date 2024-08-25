import { Observable, Subscriber } from 'rxjs';
import { RequestFormat } from './request-format.type';

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
