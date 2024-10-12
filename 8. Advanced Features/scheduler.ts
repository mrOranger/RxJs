import moment from "moment";
import { Observable, asapScheduler, asyncScheduler, from, observeOn, queueScheduler, scheduled } from "rxjs";
import { AsapScheduler } from "rxjs/internal/scheduler/AsapScheduler";
import { AsyncScheduler } from "rxjs/internal/scheduler/AsyncScheduler";
import { QueueScheduler } from "rxjs/internal/scheduler/QueueScheduler";

function intervalInSync() {
      console.log(`(intervalInSync) [${moment().locale('it').format()}] - Before the stream definition`);
      from([1, 2, 3, 4, 5]).subscribe({
            next: (value) => console.log(`(intervalInSync) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(intervalInSync) [${moment().locale('it').format()}] - After the stream definition`);
}

function intervalWithAsapScheduler () {
      console.log(`(intervalWithAsapScheduler) [${moment().locale('it').format()}] - Before the stream definition`);
      from([1, 2, 3, 4, 5], asapScheduler).subscribe({
            next: (value) => console.log(`(intervalWithAsapScheduler) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(intervalWithAsapScheduler) [${moment().locale('it').format()}] - After the stream definition`);
}

function intervalWithAsyncScheduler () {
      console.log(`(intervalWithAsyncScheduler) [${moment().locale('it').format()}] - Before the stream definition`);
      from([1, 2, 3, 4, 5]).subscribe({
            next: (value) => console.log(`(intervalWithAsyncScheduler) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(intervalWithAsyncScheduler) [${moment().locale('it').format()}] - After the stream definition`);
}
intervalInSync();
intervalWithAsyncScheduler();
intervalWithAsapScheduler();


function intervalWithScheduled<T>(observable: Observable<T>, scheduler: AsapScheduler | AsyncScheduler | QueueScheduler, schedulerName: string) {
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - Before the stream definition`);
      scheduled(observable, scheduler).subscribe({
            next: (value) => console.log(`(${schedulerName}) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - After the stream definition`);
}

intervalWithScheduled(from([1, 2, 3, 4, 5]), asapScheduler, 'ASAP');
intervalWithScheduled(from([1, 2, 3, 4, 5]), asyncScheduler, 'ASYNC');
intervalWithScheduled(from([1, 2, 3, 4, 5]), queueScheduler, 'QUEUE');

function intervalWithObserveOn <T> (observable: Observable<T>, scheduler: AsapScheduler | AsyncScheduler | QueueScheduler, schedulerName: string) {
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - Before the stream definition`);
      observable.pipe(
            observeOn(scheduler),
      ).subscribe({
            next: (value) => console.log(`(${schedulerName}) - ${value}`),
            complete: () => console.log('Stream finished'),
      });
      console.log(`(${schedulerName}) [${moment().locale('it').format()}] - After the stream definition`);
}

intervalWithObserveOn(from([1, 2, 3, 4, 5]), asapScheduler, 'ASAP');
intervalWithObserveOn(from([1, 2, 3, 4, 5]), asyncScheduler, 'ASYNC');
intervalWithObserveOn(from([1, 2, 3, 4, 5]), queueScheduler, 'QUEUE');
