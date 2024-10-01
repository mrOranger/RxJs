import { Observable, catchError, map, of, retry } from "rxjs";

interface IHttpResponse {
      response: string;
      code: number;
}

const getUsersDataFail$ = of<IHttpResponse>({ response: 'Ok', code: 400 });
const getUsersDataSuccess$ = of<IHttpResponse>({ response: 'Ok', code: 200 });


function executeCall(http$: Observable<IHttpResponse>, attempts: number = 0): Observable<IHttpResponse> {
      const httpCall$ = http$.pipe(
            map((response) => {
                  console.log('Try to get the user data');
                  if (response.code !== 200) {
                        throw new Error(`Fail to fetch data with code ${response.code}`);
                  }
                  return response;
            }),
      );

      if (attempts > 0) {
            return httpCall$.pipe(
                  retry({ count: attempts, delay: 2000 }),
                  catchError((exception: Error) => {
                        console.error(exception.message);
                        return of({ response: 'Suspended', code: 300 });
                  }),
            );
      }

      return httpCall$.pipe(
            retry(3),
            catchError((exception: Error) => {
                  console.error(exception.message);
                  return of({ response: 'Suspended', code: 300 });
            }),
      );
}

executeCall(getUsersDataSuccess$).subscribe({
      next: (result) => console.log(`${result.response} with code ${result.code}`)
});

executeCall(getUsersDataFail$).subscribe({
      next: (result) => console.log(`${result.response} with code ${result.code}`)
});

executeCall(getUsersDataSuccess$, 2).subscribe({
      next: (result) => console.log(`${result.response} with code ${result.code} after 2 attempts.`)
});

executeCall(getUsersDataSuccess$, 3).subscribe({
      next: (result) => console.log(`${result.response} with code ${result.code} after 3 attempts.`)
});
