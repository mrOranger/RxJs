import { Observable } from "rxjs";

type HTTPResponse = {
      status: number;
      message: string;
};

type ClickEvent = {
      timestamp: number;
      target: string;
};

const click$ = new Observable<ClickEvent>((subscription) => {
      const timeoutRef = setTimeout(() => {
            subscription.next({ timestamp: Date.now(), target: '#signUpButton' });
            subscription.complete();
            clearTimeout(timeoutRef);
      }, 1000);
});

const http$ = new Observable<HTTPResponse>((subscription) => {
      const timeoutRef = setTimeout(() => {
            if (Math.random() < 0.5) {
                  subscription.next({ status: 200, message: 'Signup Successfully!' });
                  subscription.complete();
            } else {
                  subscription.error({ status: 422, message: 'Invalid credentials!' });
            }
            clearTimeout(timeoutRef);
      }, Math.floor(Math.random() * 1000));
});

click$.subscribe({
      next: (event) => {
            console.log(`Clicked on ${event.target}`);
            http$.subscribe({
                  next: (response) => console.log(response.message),
                  error: () => console.error('An error occurred!'),
                  complete: () => console.log('HTTP request completed!'),
            });
      }
});

