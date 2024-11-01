import { BehaviorSubject } from "rxjs";

const board = new BehaviorSubject<string>('0-0');

const firstObserver = board.subscribe({
      next: (score) => console.log(`(firstObserver): ${score}`),
      complete: () => console.log(`firstObserver - The game is over!`),
});

board.next('0-1');
board.next('0-2');
board.next('1-2');
board.next('1-3');

const secondObserver = board.subscribe({
      next: (score) => console.log(`(secondObserver): ${score}`),
      complete: () => console.log(`secondObserver - The game is over!`),
});


board.next('2-3');

board.complete();
firstObserver.unsubscribe();
secondObserver.unsubscribe();
