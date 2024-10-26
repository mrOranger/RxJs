# Common Operators

As we mentioned before, a part of a stream is the set of operators that are applied to an Observable and transforms the emitted values in new ones whose result is made by the composition of the operators applied to it. The set of operators known as **Pipe** is the result of the application of Functional Programming in RxJs, in fact, each operators is side-effect free, and does not modify the emitted value, while makes a new copy and applies the function in the Pipe. Thinking to our problems as a set of functions to apply to some values is the core concepts of Reactive Programming. In fact, RxJs provides some useful built-in operators that we can combine to some our problem, some examples are `map`, `filter` from `Array` in JavaScript, we wll see that RxJs contains a set of similar operators. Digging deeper theoretically, RxJs Operators are high order-functions that does not changes the emitted values from an Observable, rather then returning a new Observable containing the result of the operator's application to
that value. Moreover, operators are lazily-evaluated, meaning that no operator is evaluation until a value is emitted thus an Observer is attached to the resulting Observable.

As you probably understand, in this chapter we are going to examine the core RxJs operators, of course we cannot analyze all the operators because the list is quite longer, and you can have a look of all the operators [**here**](https://rxjs.dev/guide/operators), however we will have a look to the core operators distinguished in: transformation operators, filtering operators and aggregate operators.

For each operator we will use a Marble Diagram to see how does it works, however, keep in mind that each operator does not return a new plain value, indeed, it returns an Observable resulting from the application of the operator to the input Observable. That is the main difference between the classic Functional Programming functions in JavaScript like ´filter´, ´map´ that can be applied to an Array, and the RxJs operators, because no intermediate values is returned for each operator's layer, instead, a new Observable is returned, and since Observables are Lazy Evaluated data structures, no resources are allocated until someone subscribes to the Observable and its Pipe.

## Transformation operators

Transformation operators change the value emitted by the Observable by applying a function to each of them. Differently from others categories, we will see that sometimes these operators will not alter the total size of the Observable, however, they just limited themselves to produce a new value for each emitted. In this section we will see two operators: ´map´ to transform each Observable's values and ´pairwise´ for grouping values.

### Mapping values with `map`

`map` is an **immutable** meaning that it transforms the data without updating the value that is actually emitted by the Observable, and **one-to-one** that is it does not change the size of the original emitted values. The following figure shows briefly how the map operator works in practice:

<p align="center">
    <img src="../assets/2. Common Operators/map.png" alt="Map Operator" style="width:100%">
</p>

Map is similar to the [**Adapter Design Pattern**](https://en.wikipedia.org/wiki/Adapter_pattern), since it creates a common interface to share data between a source and the corresponding destination, which has incompatible data type. In the sam way, in the previous figure the Observable emits some circles while the Observer requires to observer triangles, therefore, map interpose itself between them to make to convert circles in triangles such that the Observer now can work correctly.

### Pairing values with `pairwise`

Differently from `map`, `pairwise` is not an immutable operator, because transforms the input Observable in another one with a different size. In its implementation, `pairwise` groups each emitted value in consecutive couples of elements, like in the below image:

<p align="center">
    <img src="../assets/2. Common Operators/pairwise.png" alt="Pairwise Operator" style="width:100%">
</p>

there are two interesting things in this operator: the former is that, respect to `map` it does not accept any additional parameter; on the other hand, the latter, as we can see from the Marble Diagram, is that each couple is emitted as soon as the latest value in the couple is emitted by the source, in fact, `[2,3]` has been emitted as soon as `3` is emitted by the source.

### Examples

Examples about these operators can be found in [**transformation-operators.ts**](./transformation-operators.ts):

```typescript
from(users)
      .pipe(
            map<User, UserWithUsername>((user) => ({
                  id: user.id,
                  name: `${user.name} (${user.username})`,
            })),
      )
      .subscribe({
            next: (user) => console.log(user),
      });
```

the first example shows how to use the `map` operators, I want to map each `User` in a new type known `UserWithUsername` having just two fields `id` and `name`, thus, using `map` I'm passing a function that takes a single `User` as input and returns a new user of type `UserWithUsername`. As you can see, I specified two generic parameters to `map`, representing the type of the input value and the type of the expected output.

```typescript
from(users)
      .pipe(
            map<User, UserWithUsername>((user) => ({
                  id: user.id,
                  name: `${user.name} (${user.username})`,
            })),
            pairwise(),
      )
      .subscribe({
            next: ([first, second]) => console.log(`[${first.name}] will play against [${second.name}]`),
      });
```

in the latter example, I combined `map` with `pairwise` creating a sort of board representing each match that a User will play. As you can see, `pairwise` does not requires additional parameters, because its behavior can be defined without using any other input, respect to `map` that requires a mapping function to apply.

## Filtering operators

Respect to transformation operators, filtering could not return an Observable of the same size, in fact, they are known to alter the input source based on a function's type known as **predicate**.

### Filtering distinct values using `distinct` and `distinctUntilChanged`

Sometimes Observables can emit the same value multiple times, however, we are not interested in perform the same operations for each value but only in new values. Thus, `distinct` returns a new Observable without repetition, as can we see from the following Marble Diagram:

<p align="center">
    <img src="../assets/2. Common Operators/distinct.png" alt="Distinct Operator" style="width:100%">
</p>

the interesting part of this diagram it that, as we can notice, the operators maintains an internal state, that allows it to check that a value to emit is distinct respect to its previous value. In fact, once the first `2` has been emitted, the second `2` will not be emitted, however, the value `9` will be emitted at the same moment as has been produced by the input source. Moreover, `distinct` keeps an internal history of the emitted values, thus, since `2` has been emitted previously, it will not be emitted again after applying `distinct` to the input Observable.

Moreover, `distinct` does not require a predicate as parameter, but the name of the key to use for compare non primitive values such as objects.

While `distinct` keeps an internal history of the emitted values, `distinctUntilChanged` compares the current emitted value respect to the latest one, as we can see from the Marble Diagram:

<p align="center">
    <img src="../assets/2. Common Operators/distinctUntilChanged.png" alt="DistinctUntilChanged Operator" style="width:100%">
</p>

`distinctUntilChanged` requires an optional parameter, that is a predicate, to determine how to compare two values. The predicate is optional because the default behavior of the operator is to use `===` operator, and, of course, there is no problem for primitive values like `number` but problems arise in using `Object`. Of course, we will see deeper this problem in the final examples.

### The classic `filter`

Like in `Array.prototype.filter`, `filter` in RxJs acts in the same way, returning an output Observable whose values satisfies the input predicate of the operator. We can see how does it works from the following Marble Diagram:

<p align="center">
    <img src="../assets/2. Common Operators/filter.png" alt="Filter Operator" style="width:100%">
</p>

### Examples

All the examples that we will see are in [**filtering-operators.ts**](./filtering-operators.ts). The former example shows how can we use `distinct` to emit distinguished values:

```typescript
from(shoppingBag)
      .pipe(distinct((item) => `${item.name} ${item.price}`))
      .subscribe({
            next: (item) => console.log(`(distinct) - [${item.name}, ${item.price}]`),
      });
```

as you can see, since the Observable is emitting objects, we have to pass a function to `distinct` indicating the how to distinguish values between themselves. If there is only one key to use as discriminator, the simplest way is to return the object's value having that key, however, in this example we want to compare elements using different keys, thus, I'm going to use a string, whose value is the combination of the object's values having that specified keys.

```typescript
from(shoppingBag)
      .pipe(
            distinctUntilChanged(
                  (firstItem, secondItem) => firstItem.name === secondItem.name && firstItem.price === secondItem.price,
            ),
      )
      .subscribe({
            next: (item) => console.log(`(distinctUntilChanged) - [${item.name}, ${item.price}]`),
      });
```

respect to `distinct`, `distinctUntilChanged` requires a predicate as optional argument, indicating the condition making two object equals, in this case, the name and the price of two objects have to been the same.

Finally, the latest example shows how to use `filter`:

```typescript
from(shoppingBag)
      .pipe(
            filter((item) => item.price > 2),
            map((item) => item.name),
      )
      .subscribe({
            next: (item) => console.log(`(filter) - [${item}]`),
      });
```

the predicate passed to `filter` indicates which values will be kept in the resulting Observable. However, I would like to focus on the importance of operator's order in a chain, in fact, switching the two operators, `map` will be executed `n` times and the same for `filter`, however, switching the operators, `filter` will be executed `n` times, while `map` `m` where `n > m`, resulting in a performances' improvement.

## Mathematical and aggregating operators

Up to this moment, each operator we saw returns a new set of elements, empty or not. The new operators that we are going to introduce do not return a collection but single values. Moreover, we can split these operators in two groups: the former includes all the mathematical operators like `min`, `max` and `count`; on the other hand, the latter includes the aggregating operators like `reduce` and `scan`. Since the former group includes operators quite easier to understand respect to the latter, we will focus only on the second group of operators

### `scan` and `reduce`, aggregating operators

Let's consider this common example, we have a set of numbers and we would like to compute the mean of this elements, then we are going to sum each of them and then divide the result for the number of elements. Therefore, the `reduce` operator acts in a similar way, iterating for each element of the collection computing a new single value, however, differently from `map` or `filter`, reduce requires a new mandatory parameter in addiction to the set of elements, that is the **initial value** of the result, back to the mean example, the initial value is `0`.

We can represent `reduce` in the following way:

<p align="center">
    <img src="../assets/2. Common Operators/reduce.png" alt="Reduce Operator" style="width:100%">
</p>

The figure representing `reduce` is quite trivial, let's consider a data source composed of only blue circles, each circle contains a number. The `reduce` operator takes a circle and returns the same circle containing a different number which is the result of the sum between the value in the circle and a curry given in input to the function. Now, the curry is updated each time that a value is processed, and its value is updated to be the sum between the previous curry, plus the current number inside the current circle. Supposing the the curry is 0, the result is one single circle, whose value is the sum of each circle

An interesting variation of `reduce` is `scan`, while `reduce` returns only the final aggregated value, `scan` returns the intermediate aggregated values for all the input elements. Therefore, `scan` returns the same number of elements respect to the input set.

The working of `scan` is shown in this figure, starting from the `reduce` operator, we do not return the final result, moreover, we are returning each intermediate value:

<p align="center">
    <img src="../assets/2. Common Operators/scan.png" alt="Scan Operator" style="width:100%">
</p>

The figure representing `scan` is quite similar to previous which represents `reduce`, however, as we can observe and supposing that the curry is 0, each time a new circle is emitted, whose value is the sum of the updated curry and the corresponding emitted circle's value from the source.

### Examples

Let's see how can we combine these operators to manage difficult tasks like those in [**aggregate-operators**](aggregate-operators.ts). In the former example, we would like to get all the list of ingredients from a list of recipes, without duplicates:

```typescript
from(recipes).pipe(
      filter((recipe) => recipe.rating > 4),
      map((recipe) => recipe.ingredients),
      reduce((acc, recipe) => {
            const ingredients = acc.concat(recipe);
            return Array.from(new Set(ingredients));
      }, <string[]>[]),
);
```

using `filter` we are considering only those recipes have a rating greater than 4, then using `map` we get only the set of ingredients in each recipe. Finally, the `reduce` operator merges all the ingredients in an array, and then using a `Set` we let JavaScript to remove duplicates from the resulting array.

The latter example is more cumbersome rather than the former, because we are using an intermediate data structure:

```typescript
from(recipes)
      .pipe(
            filter((recipe) => recipe.rating > 4),
            map((recipe) => recipe.rating),
            scan((acc, rating, index) => ({ mean: acc.mean + rating, size: index }), { mean: 0, size: 0 }),
            map(({ mean, size }) => mean / (size + 1)),
      )
```

as we can see, `scan` returns a data structure containing the computed mean up to this point, and the number of ratings having value greater then 4. Doing so, we are ensuring that the function is side-effect free, and does not depends on other external variables.

## Additional Operators

There are few additional operators useful for daily tasks, since these operators are not complicated I will not show any diagram or code, while I will describe them briefly:

- `take` is a filtering operator, returning a subset of the input elements whose length is indicated by the parameter. Similar to take `first` and `last` return only the first and the last elements in the input collection.
- `tap` is the most interesting since is a **side-effect** operator that executes something without altering the input collection, in fact, it does not returns any value. Moreover, `tap` is useful for example in HTTP call, if you would like to inform the user about the loading progress.

Up to this point, we saw the most common operators in RxJs, now, I would like to make a question. Suppose that we would like to use the same operators of RxJs for an input array, shall we chose to use RxJs or the commonest operator defined in the `Array` class? I made the question because the answer let us to understand how useful is this library, and why should we work harder in understanding how RxJs works. The answer to the question is RxJs, and to explain why, let's see the following example:

```typescript
['Mario', 'Francesco', 'Federica']
      .filter((name) => name.startsWith('F'))
      .map((name) => name.toLocaleUpperCase())
      .forEach((name) => console.log(name)); // FRANCESCO, FEDERICA
```

for each step of the chain, JavaScript creates an intermediate value before apply the function, that is a new copy of the input array `['Mario', 'Francesco', 'Federica']` is created before the execution of the first function, then, after the execution of the `filter` function, a new copy of the input array `['Francesco', 'Federica']` is created, and then after the execution of the `map` function another copy `['FRANCESCO', 'FEDERICA']` is created, and so on and so forth ...

The same example in RxJs is written as follows:

```typescript
from(['Mario', 'Francesco', 'Federica'])
      .pipe(
            filter((name) => name.startsWith('F')),
            map((name) => name.toLocaleUpperCase()),
      )
      .subscribe({
            next: (value) => console.log(value),
      });
```

as you can notice, the `forEach` function of the first example takes as argument an array, while the Observable only a single element, this means a single value goes through the pipe without creating intermediate values, that is a smaller set of resources are required in using RxJs, also because the Observer and the operators are light object that do not require an excessive amount of memory.
