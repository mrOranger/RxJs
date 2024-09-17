import { filter, interval, map, switchMap, } from "rxjs";
import { recipies } from "../Database/recipies.database";

interval(2000).pipe(
    map(() => Math.random()),
    map((randomNumber) => Math.floor(randomNumber * recipies.length) % recipies.length),
    switchMap((randomIndex) => recipies.slice(randomIndex, randomIndex + 1)),
    filter((recipie) => recipie.difficulty === 'Easy'),
    switchMap((recipie) => recipie.instructions),
).subscribe({
    next: (recipies) => console.log(recipies),
});