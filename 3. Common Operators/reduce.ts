import { filter, from, map, reduce } from 'rxjs';
import { recipies } from '../Database/recipies.database';

from(recipies)
      .pipe(
            filter((recipie) => recipie.difficulty === 'Easy'),
            reduce(
                  (acc, recipie) => {
                        return { sum: acc.sum + recipie.rating, numberOfElements: acc.numberOfElements + 1 };
                  },
                  { sum: 0, numberOfElements: 0 },
            ),
            map((elements) => elements.sum / elements.numberOfElements),
      )
      .subscribe({
            next: (mean) => console.log(mean),
            error: (err) => console.log(err),
            complete: () => console.log('completed'),
      });
