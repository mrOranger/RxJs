import { filter, from, map, reduce, scan } from 'rxjs';
import { recipes } from '../Database/recipes.database';

from(recipes)
      .pipe(
            filter((recipe) => recipe.rating > 4),
            map((recipe) => recipe.ingredients),
            reduce((acc, recipe) => {
                  const ingredients = acc.concat(recipe);
                  return Array.from(new Set(ingredients));
            }, <string[]>[]),
      )
      .subscribe({
            next: (ingredients) => console.log(ingredients),
      });

from(recipes)
      .pipe(
            filter((recipe) => recipe.rating > 4),
            map((recipe) => recipe.rating),
            scan((acc, rating, index) => ({ mean: acc.mean + rating, size: index }), { mean: 0, size: 0 }),
            map(({ mean, size }) => mean / (size + 1)),
      )
      .subscribe({
            next: (mean) => console.log(`mean of rating greater than 4 - [${mean}]`),
      });
