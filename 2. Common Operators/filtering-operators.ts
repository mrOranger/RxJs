import { distinct, distinctUntilChanged, filter, from, map } from 'rxjs';

const shoppingBag = [
      { name: 'bread', price: 5.5 },
      { name: 'salt', price: 2 },
      { name: 'water', price: 1 },
      { name: 'water', price: 1.5 },
      { name: 'water', price: 1 },
      { name: 'salt', price: 2 },
];

from(shoppingBag)
      .pipe(distinct((item) => `${item.name} ${item.price}`))
      .subscribe({
            next: (item) => console.log(`(distinct) - [${item.name}, ${item.price}]`),
      });

from(shoppingBag)
      .pipe(
            distinctUntilChanged(
                  (firstItem, secondItem) => firstItem.name === secondItem.name && firstItem.price === secondItem.price,
            ),
      )
      .subscribe({
            next: (item) => console.log(`(distinctUntilChanged) - [${item.name}, ${item.price}]`),
      });

from(shoppingBag)
      .pipe(
            filter((item) => item.price > 2),
            map((item) => item.name),
      )
      .subscribe({
            next: (item) => console.log(`(filter) - [${item}]`),
      });
