import { Observable, forkJoin, map, timer } from "rxjs";

interface IHttpResponse {
      data: string;
      code: number;
}

function makeHttpRequest(timeout: number): Observable<IHttpResponse>{
      return timer(Math.ceil(Math.random() * timeout)).pipe(
            map(() => {
                  if (Math.random() > 0.5) {
                        return { data: 'Success!', code: 200 };
                  }
                  return { data: 'Error!', code: 500 };
            }),
      );
}

forkJoin([
      makeHttpRequest(3000),
      makeHttpRequest(1000),
]).subscribe({
      next: ([firstResponse, secondResponse]) => {
            console.log(`[First call] - ${firstResponse.data}  with code ${firstResponse.code} `);
            console.log(`[Second call] - ${secondResponse.data}  with code ${secondResponse.code} `);
      }
});
