import { AsyncSubject } from "rxjs";

const async$ = new AsyncSubject();

const first$ = async$.subscribe({
      next: (message) => console.log(`Observer n.1- ${message}`),
});

const second$ = async$.subscribe({
      next: (message) => console.log(`Observer n.2- ${message}`),
});

async$.next('Hello everybody!');
async$.next('Can u hear me?');

async$.complete();
first$.unsubscribe();
second$.unsubscribe();
