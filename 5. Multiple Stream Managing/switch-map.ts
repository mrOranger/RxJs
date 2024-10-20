import { filter, interval, map, switchMap, } from "rxjs";
import { recipes } from "../Database/recipes.database";

interval(2000).pipe(
    map(() => Math.random()),
    map((randomNumber) => Math.floor(randomNumber * recipes.length) % recipes.length),
    switchMap((randomIndex) => recipes.slice(randomIndex, randomIndex + 1)),
    filter((recipe) => recipe.difficulty === 'Easy'),
    switchMap((recipe) => recipe.instructions),
).subscribe({
    next: (recipes) => console.log(recipes),
});
