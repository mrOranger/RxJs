import { combineLatest, from, interval, map } from "rxjs";

const letters$ = interval(500).pipe(
      map((number) =>String.fromCharCode(number)),
      map((char) => `A new char has been emitted ${char}`),
);

const numbers$ = interval(1000).pipe(
      map(() => Math.random()),
      map((number) => `A new number has been emitted ${number}`),
);

combineLatest([letters$, numbers$]).subscribe({
      next: (value) => console.log(value),
});

interface Student {
      firstName: string;
      lastName: string;
      mark: number;
}

const studentsNotPassed$ = from<Student[]>([
      { firstName: 'Mario', lastName: 'Rossi', mark: 17, },
      { firstName: 'Federico', lastName: 'Rossi', mark: 12, },
      { firstName: 'Maria', lastName: 'Rossi', mark: 11, },
      { firstName: 'Federica', lastName: 'Rossi', mark: 17, },
]);


const studentsPassed$ = from<Student[]>([
      { firstName: 'Angelo', lastName: 'Verdi', mark: 18, },
      { firstName: 'Angela', lastName: 'Neri', mark: 29, },
      { firstName: 'Marta', lastName: 'Bruni', mark: 21, },
      { firstName: 'Marco', lastName: 'Gialli', mark: 30, },
]);

combineLatest([
      studentsPassed$,
      studentsNotPassed$,
]).subscribe({
      next: ([ passed, notPassed]) => {
            console.log(`${passed.firstName} ${passed.lastName} passed with exam with mark ${passed.mark}`);
            console.log(`${notPassed.firstName} ${notPassed.lastName} not passed with exam with mark ${notPassed.mark}`);
      },
});
