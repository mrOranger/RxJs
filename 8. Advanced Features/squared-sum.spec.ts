import { from, map, reduce } from "rxjs";

describe('test observable', () => {

      it('should returns 0, when the input set is []', (done) => {
            from([]).pipe(
                  map((value) => value * value),
                  reduce((acc, value) => acc + value, 0),
            ).subscribe({
                  next: (value) => {
                        expect(value).toEqual(0);
                        done();
                  },
            });
      });

      it('should returns 55, when the input set is [1, 2, 3, 4, 5]', (done) => {
            from([1, 2, 3, 4, 5]).pipe(
                  map((value) => value * value),
                  reduce((acc, value) => acc + value, 0),
            ).subscribe({
                  next: (value) => {
                        expect(value).toEqual(55);
                        done();
                  },
            });
      });

});
