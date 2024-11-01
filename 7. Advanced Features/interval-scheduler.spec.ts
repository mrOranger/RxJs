import { filter, interval, map, take } from "rxjs";
import { TestScheduler } from "rxjs/testing";

describe(`Testing an Observable emitting values each 2s`, () => {

      const observable$ = interval(200).pipe(
            take(5)
      );

      it (`should emit values [0, 1, 2, 3, 4]`, (done) => {
            let currentValue = 0;

            observable$.subscribe({
                  next: (value) => expect(value).toEqual(currentValue++),
                  error: () => done.fail(),
                  complete: () => done(),
            });

      });

      it (`should emit values [0, 1, 2, 3, 4] using marbles diagram`, () => {
            const aTestingFunction = (expected: number) => expect(expected).toBeDefined();
            const anotherTestingFunction = (expected: number, actual: number) => expect(expected).toEqual(actual);
            const scheduler = new TestScheduler((expected, actual) => {
                  aTestingFunction(expected);
                  aTestingFunction(actual);
                  anotherTestingFunction(expected, actual);
            });

            const source$ = scheduler.createColdObservable('---a---b---c---|', {a: 1, b: 2, c: 3}).pipe(map((x) => x*2));
            const expected$ = scheduler.createColdObservable('---A---B---C---|', {A: 2, B: 4, C: 6});

            scheduler.expectObservable(source$).toEqual(expected$);
            scheduler.flush();
      });

      it (`should check that the source [5, 7, 10, 2] is mapped in [10, 14]`, () => {

            const checkValuesEquality = (expected: number, actual: number) => expect(expected).toEqual(actual);
            const scheduler = new TestScheduler(checkValuesEquality);
            const mapping = map((value: number) => value*2);
            const filtering = filter((value: number) => value % 2 === 1);


            const input$ = scheduler.createColdObservable('-a--b---c-------d-|', {a: 5, b: 7, c: 10, d: 2});
            const output$ = scheduler.createColdObservable('-a--b-------------|', { a: 10, b: 14 });


            scheduler.expectObservable(input$.pipe(filtering, mapping)).toEqual(output$);
            scheduler.flush();
      });

});

